import { Container } from "react-bootstrap"
import { EquipmentList } from "./components/EquipmentList";

export const AdminHome = () => {

  return (
    <Container className="mt-4">
        <EquipmentList />
    </Container>
  )
}