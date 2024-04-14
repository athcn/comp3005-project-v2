import { useContext, useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useRestApi } from "../../../../sharedHooks/useRestApi";
import { AuthContext } from "../../../Auth/AuthProvider";

interface NewExerciseModalProps {
  show: boolean;
  setShow: (shouldShow: boolean) => void;
}

export const BillingModal = ({show, setShow}: NewExerciseModalProps) => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [members, setMembers] = useState<any>([]);
  const [memberId, setMemberId] = useState("default");
  const [charge, setCharge] = useState(0);

  useEffect(() => {
    fetch(getFormatedUrl("admin/members"))
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response failed');
      } 
      return response.json();
    })
    .then(data => {
      setMembers(data.members);
    })
  }, [show]);

  const createBill = () => {
    if (!userId) return;

    fetch(getFormatedUrl('admin/create-bill'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memberId,
        charge,
        created: new Date().toISOString().split("T")[0],
        paid: false,
      })
    }).then(response => {
      if (response.ok) {
        setShow(false);
      }
    });
  }

  const onClose = () => {
    setShow(false);
  }

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">
          <b>Create Bill</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label >Select member</Form.Label>
            <InputGroup>
              <Form.Select defaultValue="default" value={memberId} onChange={value => setMemberId(value.target.value)}>
                <option value="default" disabled>Select a member</option>
                {
                  members.map(member => {
                    return (
                      <option key={member.memberId} value={member.memberId}>{member.memberName}</option>
                    )
                  })
                }
              </Form.Select>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Charge amount</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                placeholder="Enter the amount to charge member"
                value={charge || ''}
                onChange={value => setCharge(Number(value.target.value))}
              />
              <InputGroup.Text>$</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="primary" onClick={createBill}>
          Create Bill
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}