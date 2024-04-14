import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { useRestApi } from "../../../../sharedHooks/useRestApi";

interface NewExerciseModalProps {
  show: boolean;
  setShow: (shouldShow: boolean) => void;
  billId: string;
  setBillId: (billId: string) => void;
}

export const PayModal = ({show, setShow, billId, setBillId}: NewExerciseModalProps) => {
  const {getFormatedUrl} = useRestApi();
  const [charge, setCharge] = useState('');
  const [chargedOn, setChargedOn] = useState('');
  const [cardNum, setCardNum] = useState<number | null>(null);
  const [cvv, setCVV] = useState<number | null>(null);
  const [cardExpire, setCardExpire] = useState('');
  const [alert, setAlert] = useState('');

  useEffect(() => {
    if (!billId) return;
    setAlert('');

    const params = new URLSearchParams({ billId: billId });
    fetch(getFormatedUrl(`member/bill?${params.toString()}`))
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response failed');
      } 
      return response.json();
    })
    .then(data => {
      setCharge(data.charged);
      setChargedOn(new Date(data.created).toISOString().split("T")[0]);
    })
  }, [show, billId]);

  const payBill = () => {
    if (!billId) return;

    // Simple fake check for card details
    if (cardNum == null) {
      setAlert('Invalid card number (can not be empty or contain letters)');
      return;
    } else if (cvv == null) {
      setAlert('Invalid cvv (can not be empty or contain letters)');
      return;
    } else if (cardExpire == '') {
      setAlert('Invalid expiry date (can not be empty)');
      return;
    }

    // If all checks pass consider it paid!
    fetch(getFormatedUrl('member/pay-bill'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        billId,
        paidOn: new Date().toISOString().split("T")[0]
      })
    }).then(response => {
      if (response.ok) {
        setShow(false);
      }
    });
  }

  const onClose = () => {
    setBillId('');
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
            <Form.Label>Charge amount</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                value={charge || ''}
                disabled
              />
              <InputGroup.Text>$</InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Charged on</Form.Label>
            <Form.Control
              type="date"
              value={chargedOn || ''}
              disabled
            />
          </Form.Group>
        </Form>
        {alert != "" ? <Alert variant="danger">{alert}</Alert> : null}
        <Card>
          <Card.Header>Card Details (Fake)</Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Control
                type="string"
                placeholder="Card Number"
                value={cardNum || ''}
                onChange={value => setCardNum(Number(value.target.value))}
              />
            </Form.Group>
            <Row>
              <Col sm={6}>
                  <Form.Control 
                    type="text" 
                    placeholder="CVV"
                    value={cvv || ''}
                    onChange={value => setCVV(Number(value.target.value))}
                  />
                </Col>
                <Col sm={6}>
                  <Form.Control 
                    type="date"
                    value={cardExpire} 
                    onChange={value => setCardExpire(value.target.value)}
                  />
                </Col>
            </Row>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="primary" onClick={payBill}>
          Pay Bill
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}