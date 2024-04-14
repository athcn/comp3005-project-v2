import { useContext, useEffect, useState } from "react";
import { Button, Card, Row, Table } from "react-bootstrap"
import { useRestApi } from "../../../../sharedHooks/useRestApi";
import { AuthContext } from "../../../Auth/AuthProvider";
import { PayModal } from "./PayModal";

export const MemberBilling = () => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [bills, setBills] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [billId, setBillId] = useState('');

  useEffect(() => {
    if (!userId) return;

    const params = new URLSearchParams({ memberId: userId });
    fetch(getFormatedUrl(`member/bills?${params.toString()}`))
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

  const openModal = (billId: string) => {
    setBillId(billId);
    setShowModal(true);
  }

  return (
    <Card className="mt-4 ms-3 me-3 ">
      <PayModal show={showModal} setShow={setShowModal} billId={billId} setBillId={setBillId} />
      <Card.Header className="h3 text-primary"><b>Current and Past Bills</b></Card.Header>
      <Card.Body>
        <Table responsive>
            <thead>
              <tr>
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
                  const paidOn = row.paidOn ? new Date(row.paidOn).toISOString().split("T")[0] : 'Unpaid';

                  return (
                    <tr key={row.billId}>
                      <td>{row.charged}</td>
                      <td>{created}</td>
                      <td>
                        {
                          row.paidStatus ? 
                            <Button disabled variant="success">Paid</Button> : 
                            <Button type="button" variant="danger" onClick={() => openModal(row.billId)}>Pay now</Button>
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