import { useState } from "react"
import { Col, Container, Row } from "react-bootstrap";
import { AchievementsList } from "./components/AchievementsList";
import { ExercisesList } from "./components/ExercisesList";
import { RoutinesList } from "./components/RoutinesList";
import { GoalsList } from "./components/GoalsList";


export const MemberHome = () => {
  const [refresh, setRefresh] = useState(false); // Used to refresh useEffects

  return (
    <Container className="mt-4">
      <Row>
        <Col sm={8}>
          <GoalsList refresh={refresh} setRefresh={setRefresh} />
          <RoutinesList />
          <ExercisesList />
        </Col>
        <Col sm={4}>
          {/* Potential place to add signed up schedules!! */}
          <AchievementsList refresh={refresh} setRefresh={setRefresh} />
        </Col>
      </Row>
    </Container>
  )
}