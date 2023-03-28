import React from "react";
import { Col, Grid, Row } from "rsuite";
import { RoomsProvider } from "../Auth/RoomContext";
import Sidebar from "../Components/Sidebar";

const Home = () => {
  return (
    <>
      <RoomsProvider>
        <Grid fluid className="h-100">
          <Row className="h-100">
            <Col xs={24} md={8} className="h-100">
              <Sidebar />
            </Col>
          </Row>
        </Grid>
      </RoomsProvider>
    </>
  );
};

export default Home;
