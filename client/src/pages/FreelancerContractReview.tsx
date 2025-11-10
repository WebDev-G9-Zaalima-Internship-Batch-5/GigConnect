import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { acceptContractByFreelancer, getContractById, rejectContractByFreelancer } from "@/services/contracts.service";
import { toast } from "sonner";

export default function FreelancerContractReview() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<any>(null);
  const [ack, setAck] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        if (contractId) {
          const c = await getContractById(contractId);
          setContract(c);
        }
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Failed to load contract");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [contractId]);

  const acceptMut = useMutation({
    mutationFn: async () => acceptContractByFreelancer(contractId as string),
    onSuccess: () => {
      toast.success("Contract accepted");
      setContract((c: any) => ({ ...c, freelancerAccepted: true, freelancerAcceptedAt: new Date().toISOString() }));
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to accept"),
  });

  const rejectMut = useMutation({
    mutationFn: async () => rejectContractByFreelancer(contractId as string),
    onSuccess: () => {
      toast.success("Contract rejected");
      setContract((c: any) => ({ ...c, freelancerAccepted: false, freelancerAcceptedAt: undefined }));
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to reject"),
  });

  if (loading || !contract) {
    return (
      <div className="container mx-auto max-w-3xl p-6 text-sm text-muted-foreground">Loading...</div>
    );
  }

  const total = contract?.escrowRequired ?? contract?.agreedRate ?? 0;

  return (
    <div className="container mx-auto max-w-3xl p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Contract Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Agreed Rate</div>
              <div className="text-base font-semibold">{contract.agreedRate}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Agreed Duration</div>
              <div className="text-base font-semibold">{contract.agreedDuration}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Start Date</div>
              <div className="text-base font-semibold">{new Date(contract.startDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">End Date</div>
              <div className="text-base font-semibold">{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "-"}</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Terms</div>
            <div className="text-sm whitespace-pre-wrap text-muted-foreground">{contract.terms}</div>
          </div>

          <Separator />
          <div className="font-medium mb-2">Milestones</div>
          {Array.isArray(contract.milestones) && contract.milestones.length > 0 ? (
            <ul className="text-sm text-muted-foreground space-y-2">
              {contract.milestones.map((m: any, i: number) => (
                <li key={i} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{m.title}</div>
                    <div className="text-xs">{m.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{m.amount}</div>
                    <div className="text-xs">Due {new Date(m.dueDate).toLocaleDateString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-muted-foreground">No milestones. Total amount: {total}</div>
          )}
          <Separator />
          <div className="flex items-start gap-2">
            <input id="ack" type="checkbox" className="mt-1" checked={ack} onChange={(e) => setAck(e.target.checked)} />
            <label htmlFor="ack" className="text-sm text-muted-foreground">
              I have read and understood the entire contract including scope, milestones, timelines, and payment terms.
            </label>
          </div>
          <div className="flex gap-2 pt-2">
            <Button disabled={acceptMut.isPending || !ack} onClick={() => acceptMut.mutate()}>Accept</Button>
            <Button variant="outline" disabled={rejectMut.isPending || !ack} onClick={() => rejectMut.mutate()}>Reject</Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
