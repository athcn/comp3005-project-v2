import { Col, Container, Row } from "react-bootstrap"
import { TimetableOverview } from "./components/TimetableOverview"
import { TimetableSidebar } from "./components/TimetableSideBar"
import { TimetableModal } from "./components/TimetableModal"
import { useState } from "react"

export const TrainerHome = () => {
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scheduleId, setScheduleId] = useState<string | null>(null);

  return (
    <Container className="mt-4">
      <TimetableModal show={showModal} setShow={setShowModal} scheduleId={scheduleId} setScheduleId={setScheduleId} refresh={refresh} setRefresh={setRefresh}/>
      <Row>
        <Col sm={10}>
          <TimetableOverview refresh={refresh}/>
        </Col>
        <Col sm={2}>
          <TimetableSidebar showModal={showModal} setShowModal={setShowModal}/>
        </Col>
      </Row>
    </Container>
  )
}