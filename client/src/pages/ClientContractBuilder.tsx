import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  proposeContract,
  updateContractDraft,
  submitContract,
  getContractByApplication,
  getContractById,
  fundEscrowInit,
  verifyRazorpayPayment,
} from "@/services/contracts.service";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

function useQueryParam(name: string) {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search).get(name), [search, name]);
}

export default function ClientContractBuilder() {
  const navigate = useNavigate();
  const { contractId } = useParams();
  const applicationId = useQueryParam("applicationId");

  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<any>(null);
  const [agreedRate, setAgreedRate] = useState<number>(0);
  const [agreedDuration, setAgreedDuration] = useState<string>("");
  const [terms, setTerms] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [milestones, setMilestones] = useState<Array<{ title: string; description: string; amount: number; dueDate: string }>>([]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        if (contractId) {
          const c = await getContractById(contractId);
          setContract(c);
          setAgreedRate(c.agreedRate ?? 0);
          setAgreedDuration(c.agreedDuration ?? "");
          setTerms(c.terms ?? "");
          setStartDate(c.startDate ? new Date(c.startDate).toISOString().slice(0, 10) : "");
          setEndDate(c.endDate ? new Date(c.endDate).toISOString().slice(0, 10) : "");
          setMilestones(Array.isArray(c.milestones) ? c.milestones.map((m: any) => ({
            title: m.title,
            description: m.description,
            amount: m.amount,
            dueDate: new Date(m.dueDate).toISOString().slice(0,10),
          })) : []);
        } else if (applicationId) {
          try {
            const existing = await getContractByApplication(applicationId);
            setContract(existing);
            navigate(`/client/contracts/${existing._id}`);
            return;
          } catch {}
        }
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Failed to load contract");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [contractId, applicationId, navigate]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        applicationId: applicationId as string,
        agreedRate: Number(agreedRate),
        agreedDuration,
        milestones,
        terms,
        startDate,
        endDate: endDate || undefined,
      };
      if (contract?._id) {
        const updated = await updateContractDraft(contract._id, payload);
        setContract(updated);
        return updated;
      } else {
        const draft = await proposeContract(payload);
        setContract(draft);
        navigate(`/client/contracts/${draft._id}`);
        return draft;
      }
    },
    onSuccess: () => {
      toast.success("Draft saved");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to save draft");
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => submitContract(contract._id),
    onSuccess: () => {
      toast.success("Contract submitted to freelancer");
      setContract((c: any) => ({ ...c, clientSubmittedAt: new Date().toISOString() }));
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to submit"),
  });

  const fundMutation = useMutation({
    mutationFn: async () => fundEscrowInit(contract._id),
    onSuccess: async (data) => {
      if (data?.alreadyFunded) {
        toast.info("Escrow already funded");
        return;
      }
      if (!data?.orderId || !data?.keyId) {
        toast.error("Failed to initiate payment");
        return;
      }
      // Ensure Razorpay script is loaded
      const loadScript = (src: string) => new Promise<boolean>((resolve) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
      });
      const ok = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!ok) {
        toast.error("Razorpay SDK failed to load");
        return;
      }
      // @ts-ignore
      const rzp = new window.Razorpay({
        key: data.keyId,
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'GigConnect',
        description: 'Escrow Funding',
        handler: async (resp: any) => {
          try {
            await verifyRazorpayPayment(contract._id, {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
            toast.success('Payment verified and escrow funded');
            const refreshed = await getContractById(contract._id);
            setContract(refreshed);
          } catch (e: any) {
            toast.error(e?.response?.data?.message || 'Payment verification failed');
          }
        },
        theme: { color: '#4f46e5' },
      });
      rzp.open();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to initiate funding"),
  });

  const addMilestone = () => {
    setMilestones((m) => ([...m, { title: "", description: "", amount: 0, dueDate: "" }]));
  };

  const updateMilestone = (idx: number, field: string, value: any) => {
    setMilestones((prev) => prev.map((m, i) => i === idx ? { ...m, [field]: field === 'amount' ? Number(value) : value } : m));
  };

  const removeMilestone = (idx: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="container mx-auto max-w-3xl p-6 space-y-4">
        <Navigation></Navigation>
      <Card>
        <CardHeader>
          <CardTitle>{contractId ? "Edit Contract" : "Create Contract"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Agreed Rate</div>
              <Input type="number" value={agreedRate} onChange={(e) => setAgreedRate(Number(e.target.value))} />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Agreed Duration</div>
              <Input value={agreedDuration} onChange={(e) => setAgreedDuration(e.target.value)} />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Start Date</div>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">End Date (optional)</div>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Terms</div>
            <Textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={6} />
          </div>

          <Separator />
          <div className="flex items-center justify-between">
            <div className="font-medium">Milestones (optional)</div>
            <Button variant="outline" size="sm" onClick={addMilestone}>Add Milestone</Button>
          </div>
          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div key={idx} className="grid sm:grid-cols-4 gap-3">
                <Input placeholder="Title" value={m.title} onChange={(e) => updateMilestone(idx, 'title', e.target.value)} />
                <Input placeholder="Description" value={m.description} onChange={(e) => updateMilestone(idx, 'description', e.target.value)} />
                <Input type="number" placeholder="Amount" value={m.amount} onChange={(e) => updateMilestone(idx, 'amount', e.target.value)} />
                <div className="flex gap-2">
                  <Input type="date" value={m.dueDate} onChange={(e) => updateMilestone(idx, 'dueDate', e.target.value)} />
                  <Button variant="ghost" onClick={() => removeMilestone(idx)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button disabled={loading || saveMutation.isPending} onClick={() => saveMutation.mutate()}>Save Draft</Button>
            <Button variant="outline" disabled={!contract?._id || submitMutation.isPending} onClick={() => submitMutation.mutate()}>Submit to Freelancer</Button>
            <Button variant="secondary" disabled={!contract?.freelancerAccepted || fundMutation.isPending} onClick={() => fundMutation.mutate()}>Fund Escrow</Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
