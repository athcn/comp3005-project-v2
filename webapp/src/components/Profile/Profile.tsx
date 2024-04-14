import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import { Alert, Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useRestApi } from "../../sharedHooks/useRestApi";

export const Profile = () => {
  const {getFormatedUrl} = useRestApi();
  const {isLoggedIn, userId} = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [avgSleep, setAvgSleep] = useState<number | null>(null);
  const [bodyFatPercentage, setBodyFatPercentage] = useState<number | null>(null);
  const [updatedValues, setUpdatedValues] = useState(false);

  useEffect(() => {
    if (!userId) return;
    // Get the member profile data
    const params = new URLSearchParams({ userId: userId });
    fetch(getFormatedUrl(`member/profile?${params.toString()}`))
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response failed');
        } 
        return response.json();
      })
      .then(data => {
        setFirstName(data.firstName);
        setLastName(data.lastName);
        if (data.currentWeight != currentWeight) setCurrentWeight(data.currentWeight);
        if (data.avgSleep != avgSleep) setAvgSleep(data.avgSleep);
        if (data.bodyFatPercentage != bodyFatPercentage) setBodyFatPercentage(data.bodyFatPercentage);
      })
      .catch(error => {
        console.error("There was a problem with fetching the profile data ", error);
      })
  }, [userId])

  
  // TODO: Redirect back to Home if not a MEMBER
  if (!userId || !isLoggedIn) {
    return;
  }

  // Submitting changes to database
  const onClick = () => {
     fetch(getFormatedUrl('member/update-profile'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        firstName,
        lastName,
        currentWeight,
        avgSleep,
        bodyFatPercentage
      })
     })
     .then(response => {
      if (response.status == 204) {
        setUpdatedValues(true);
      }
     })
  }

  // TODO: There are issues with FLOAT numbers atm (can not type '.')
  return (
    <Container>
      <Card>
        <Card.Header as="h4">Profile</Card.Header>
        <Card.Body>
          {updatedValues && <Alert variant={'success'}>
            Profile has been successfully updated!
          </Alert>}
          <Form>
            <Row className="mb-4">
              <Form.Label>Enter first and last name</Form.Label>
                <Col sm={6}>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={value => setFirstName(value.target.value)}
                  />
                </Col>
                <Col sm={6}>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={value => setLastName(value.target.value)}
                  />
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Current Weight</Form.Label>
              <InputGroup className="mb-2">
                <Form.Control 
                  type="text" 
                  placeholder="Enter current weight" 
                  value={currentWeight || ''}
                  onChange={value => setCurrentWeight(parseFloat(value.target.value))}
                />
                <InputGroup.Text>kg</InputGroup.Text>
              </InputGroup>
              <Form.Label>Average Daily Sleep</Form.Label>
              <InputGroup className="mb-2">
                <Form.Control 
                  type="text" 
                  placeholder="Enter average sleep" 
                  value={avgSleep || ''}
                  onChange={value => setAvgSleep(parseFloat(value.target.value))}
                />
                <InputGroup.Text>hours</InputGroup.Text>
              </InputGroup>
              <Form.Label>Body Fat Percentage</Form.Label>
              <InputGroup className="mb-2">
                <Form.Control 
                  type="text" 
                  placeholder="Enter body fat percentage" 
                  value={bodyFatPercentage || ''}
                  onChange={value => setBodyFatPercentage(parseFloat(value.target.value))}
                />
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Button type="button" variant="primary" onClick={onClick}>
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}