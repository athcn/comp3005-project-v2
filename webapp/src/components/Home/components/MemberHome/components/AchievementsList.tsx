/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useRestApi } from "../../../../../sharedHooks/useRestApi";
import { AuthContext } from "../../../../Auth/AuthProvider";
import { Button, Card, Table } from "react-bootstrap";

export interface Achievement {
  achievementId: string,
  description: string,
  achieved: string,
}

interface AchievementsListProp {
  refresh: boolean,
  setRefresh: (value: boolean) => void;
}

export const AchievementsList = ({refresh, setRefresh}: AchievementsListProp) => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
   // Fetching Achievements
  useEffect(() => {
    if (!userId) return;
    const params = new URLSearchParams({ userId: userId });
    fetch(getFormatedUrl(`member/achievements?${params.toString()}`))
      .then(response => {
        if (!response.ok) {
          throw "Failed to retrieve achievements";
        } 
        return response.json()
      })
      .then(data => {
        // Parsing data for viewing
        const achievements: Achievement[] = data.achievements.map((achievement) => {
          const newAchievement: Achievement = {
            achievementId: achievement.achievement_id,
            description: achievement.description,
            achieved: achievement.achieved_date,
          }
          
          return newAchievement;
        })

        setAchievements(achievements);
      })
      .catch(error => console.log(error));
  }, [refresh])

  const deleteAchievement = (achievementId: string) => {
    const params = new URLSearchParams({ achievementId: achievementId });
    fetch(getFormatedUrl(`member/delete-achievement?${params.toString()}`), {
      method: "DELETE",
    })
    .then(response => {
      if (!response.ok) {
        console.log("Failed to delete");
      } else {
        console.log("Deleted successfully");
        setRefresh(!refresh);
      }
    })
  }

  return (
    <Card>
      <Card.Header className="h3 text-primary"><b>Achievements</b></Card.Header>
      <Card.Body>
        <Table responsive>
            <thead>
              <tr>
                <th>Description</th>
                <th>Achieved</th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {
                achievements.map((achievement) => {
                  const date = (new Date(achievement.achieved)).toISOString().split("T")[0];
                  return (
                    <tr key={achievement.achievementId}>
                      <td>{achievement.description}</td>
                      <td>{date}</td>
                      <td>
                        <Button type="button" variant="danger" onClick={() => deleteAchievement(achievement.achievementId)}>
                          Remove
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