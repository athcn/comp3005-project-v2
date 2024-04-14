import { useContext, useEffect, useState } from "react";
import { Button, Card, Container, Row, Table } from "react-bootstrap"
import { useRestApi } from "../../../../sharedHooks/useRestApi";
import { AuthContext } from "../../../Auth/AuthProvider";
import { BillingModal } from "./BillingModal";

export const AdminBilling = () => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [bills, setBills] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const params = new URLSearchParams({ adminId: userId });
    fetch(getFormatedUrl(`admin/billing?${params.toString()}`))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response.status;
    })
    .then(data => {
      setBills(data.bills);
    })
  }, [refresh, showModal])

  const openModal = () => {
    setShowModal(true);
  }

  return (
    <Card className="mt-4 ms-3 me-3">
      <BillingModal show={showModal} setShow={setShowModal} />
      <Card.Header className="h3 text-primary"><b>Billing Management</b></Card.Header>
      <Card.Body>
        <Row className="mb-3 ms-2 me-2">
          <Button variant="primary" type="button" onClick={openModal}>
            Create a new bill
          </Button>
        </Row>
        <Table responsive>
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Charged Amount</th>
                <th>Created</th>
                <th>Paid Status</th>
                <th>Paid on</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {
                bills.map(row => {
                  const created = new Date(row.created).toISOString().split("T")[0];
                  const paidOn = row.paidOn ? new Date(row.paidOn).toISOString().split("T")[0] : '';

                  return (
                    <tr key={row.billId}>
                      <td>{row.memberName}</td>
                      <td>{row.charged}</td>
                      <td>{created}</td>
                      <td>
                        {
                          row.paidStatus ?
                            <Button disabled variant="success">Paid</Button> :
                            <Button disabled variant="danger">Unpaid</Button>
                        }
                      </td>
                      <td>{paidOn}</td>
                    </tr>
                  )
                })
              }
            </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}