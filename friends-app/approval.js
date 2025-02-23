document.addEventListener("DOMContentLoaded", function () {
    const API_GATEWAY_URL = "https://b85qcq4xrk.execute-api.us-west-2.amazonaws.com/dev/my-resource";
    const API_KEY = "79NHtBiXbg5SyfA15OBst2gAWmnB69rc9zdfY1V1";
    const approvalList = document.getElementById("approval-list");
    const refreshButton = document.getElementById("refresh-btn");
    const messageContainer = document.createElement("div");
    messageContainer.id = "message-container";
    document.getElementById("approval-container").insertBefore(messageContainer, document.getElementById("approval-table"));

    async function fetchApprovalList() {
        try {
            const response = await fetch(API_GATEWAY_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
                body: JSON.stringify({ 
                    body: JSON.stringify({ 
                        operation: "get_approval_list" 
                    })
                }),
                mode: "cors"
            });

            const responseBody = await response.json();
            const parsedBody = JSON.parse(responseBody.body);
            const emails = parsedBody.emails_pending_approval;

            approvalList.innerHTML = "";
            emails.forEach(email => {
                const row = document.createElement("tr");

                const emailCell = document.createElement("td");
                emailCell.textContent = email;
                row.appendChild(emailCell);

                const actionCell = document.createElement("td");
                const approveButton = document.createElement("button");
                approveButton.textContent = "Approve";
                approveButton.classList.add("approve-btn");
                approveButton.addEventListener("click", () => approveEmail(email));
                actionCell.appendChild(approveButton);
                row.appendChild(actionCell);

                approvalList.appendChild(row);
            });
        } catch (error) {
            console.error("Error fetching approval list:", error);
        }
    }

    async function approveEmail(email) {
        try {
            const response = await fetch(API_GATEWAY_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
                body: JSON.stringify({ 
                    body: JSON.stringify({ 
                        operation: "update_approval", 
                        email: email 
                    })
                }),
                mode: "cors"
            });

            if (response.ok) {
                showMessage(`Email ${email} approved successfully.`, "success");
                fetchApprovalList(); // Refresh the list
            } else {
                throw new Error('Failed to approve email');
            }
        } catch (error) {
            console.error("Error approving email:", error);
            showMessage(`Error approving email: ${error.message}`, "error");
        }
    }

    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = type;
        setTimeout(() => {
            messageContainer.textContent = "";
            messageContainer.className = "";
        }, 5000);
    }

    refreshButton.addEventListener("click", fetchApprovalList);

    fetchApprovalList(); // Initial fetch
});
