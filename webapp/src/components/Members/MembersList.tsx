import { useContext, useEffect, useState } from "react"
import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap"
import { AuthContext } from "../Auth/AuthProvider";
import { useRestApi } from "../../sharedHooks/useRestApi";
import { ProfileModal } from "./ProfileModal";

export const MembersList = () => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [members, setMembers] = useState<any>([]);

  useEffect(() => {
    if (!userId) return;
    // Get the member profile data
    const params = new URLSearchParams({ firstName, lastName });
    fetch(getFormatedUrl(`trainer/members?${params.toString()}`))
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response failed');
        } 
        return response.json();
      })
      .then(data => {
        setMembers(data.members);
      })
      .catch(error => {
        console.error("There was a problem with fetching the profile data ", error);
      })
  }, [refresh]);

  const openModal = (memberId: string) => {
    setMemberId(memberId);
    setShowModal(true);
  }

  return (
    <Container>
      <ProfileModal show={showModal} setShow={setShowModal} memberId={memberId} setMemberId={setMemberId} />
      <Card className="mt-3">
        <Card.Header>View Member Profiles</Card.Header>
        <Card.Body>
          <Form>
            <Form.Label>Search members</Form.Label>
            <Row>
              <Col sm={6}>
                <Form.Control 
                  type="text" 
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={value => setFirstName(value.target.value)}
                />
              </Col>
              <Col sm={5}>
                <Form.Control 
                  type="text" 
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={value => setLastName(value.target.value)}
                />
              </Col>
              <Col sm={1}>
              <Button type="button" onClick={() => setRefresh(!refresh)}>Search</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
        <Card.Body>
          <Table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Current Weight (kg)</th>
                <th>Body Fat Percentage</th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {
                members.map((member) => {
                  return (
                    <tr key={member.member_id}>
                      <td>{member.first_name}</td>
                      <td>{member.last_name}</td>
                      <td>{member.current_weight}</td>
                      <td>{member.body_fat_percentage}</td>
                      <td>
                        <Button type="button" variant="success" onClick={() => openModal(member.member_id)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  )
}