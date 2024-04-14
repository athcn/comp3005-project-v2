import { Button, Card, Stack } from "react-bootstrap"

interface TimetableSidebarProps {
  showModal: boolean;
  setShowModal: (shouldShow: boolean) => void;
}

export const TimetableSidebar = ({showModal, setShowModal}: TimetableSidebarProps) => {
  return (
    <Card>
      <Card.Header className="h5 text-secondary"><b>Timetable Actions</b></Card.Header>
      <Card.Body>
        <Stack direction="vertical" gap={3}>
          <Button type="button" onClick={() => setShowModal(true)}>
            Add available time
          </Button>
          <Button type="button" variant="secondary">
            Update available time
          </Button>
        </Stack>
      </Card.Body>
    </Card>
  )
}