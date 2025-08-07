HTTP status codes are like short messages from a server after a browser sends a request. They tell you if the request was successful, if something went wrong, or if more action is needed. Here's a table of the most common status codes you'll likely encounter and use in a web application.

---

### Common HTTP Status Codes

| Status Code            | Name                  | What It Means                                                                                                           |
| :--------------------- | :-------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| **1xx: Informational** |
| 100                    | Continue              | The server has received the request headers and the client should proceed with sending the request body.                |
| **2xx: Success**       |
| 200                    | OK                    | The request was successful. This is the standard response for successful HTTP requests.                                 |
| 201                    | Created               | A new resource was successfully created. This is often used after a `POST` request.                                     |
| 204                    | No Content            | The server successfully processed the request, but there is no content to send back.                                    |
| **3xx: Redirection**   |
| 301                    | Moved Permanently     | The requested resource has been assigned a new permanent URI. The browser should automatically redirect to the new URL. |
| 304                    | Not Modified          | The client's cached version of the resource is still valid. The browser should use its cached copy.                     |
| **4xx: Client Error**  |
| 400                    | Bad Request           | The server couldn't understand the request due to invalid syntax or parameters.                                         |
| 401                    | Unauthorized          | Authentication is required and has failed or hasn't been provided.                                                      |
| 403                    | Forbidden             | The server understood the request, but refuses to authorize it. The client doesn't have the necessary permissions.      |
| 404                    | Not Found             | The requested resource could not be found on the server.                                                                |
| 409                    | Conflict              | A conflict occurred with the current state of the resource, like a duplicate entry.                                     |
| 429                    | Too Many Requests     | The user has sent too many requests in a given amount of time. Used for rate limiting.                                  |
| **5xx: Server Error**  |
| 500                    | Internal Server Error | An unexpected condition was encountered by the server. This is a generic "catch-all" error.                             |
| 503                    | Service Unavailable   | The server is currently unable to handle the request due to a temporary overload or scheduled maintenance.              |
