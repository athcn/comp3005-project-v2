import { useContext, useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap"
import { useRestApi } from "../../../../../sharedHooks/useRestApi";
import { AuthContext } from "../../../../Auth/AuthProvider";

export const EquipmentList = () => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [equipment, setEquipment] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const params = new URLSearchParams({ adminId: userId });
    fetch(getFormatedUrl(`admin/equipment?${params.toString()}`))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response.status;
    })
    .then(data => {
      setEquipment(data.equipment);
    })
  }, [refresh])

  const maintenance = (equipmentId: string) => {
    fetch(getFormatedUrl('admin/equipment-maintenance'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        equipmentId,
        date: new Date().toISOString().split("T")[0],
      })
    }).then(response => {
      if (response.ok) {
        setRefresh(!refresh);
      }
    });
  }

  return (
    <Card className="mt-4">
      <Card.Header className="h3 text-primary"><b>Equipment Status</b></Card.Header>
      <Card.Body>
        <Table responsive>
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Equipment Name</th>
                <th>Serial Num</th>
                <th>Last Maintenance</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {
                equipment.map(row => {
                  const lastMaintenance = new Date(row.lastMaintenance);
                  const currentDate = new Date();
                  // Converting to days
                  const needMaintenance = ((currentDate.getTime() - lastMaintenance.getTime())/(1000*60*60*24.0)) > 30;
                  
                  return (
                    <tr key={row.equipmentId}>
                      <td>{row.roomNumber}</td>
                      <td>{row.name}</td>
                      <td>{row.serialNum}</td>
                      <td>{lastMaintenance.toISOString().split("T")[0]}</td>
                      <td>
                        <Button type="button" variant={needMaintenance ? "danger" : "success"} onClick={() => maintenance(row.equipmentId)}>
                          Performed Maintenance
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
  )
}