import { Card, CardContent, Container, Stack, Step, StepContent, StepLabel, Stepper, useMediaQuery } from '@mui/material';
import React, { useRef, useState } from 'react';
import PersonalData from './PersonalData';
import Skin from './Skin';
import Vehicle from './Vehicle';
import DataSummary from './DataSummary';
import dayjs from 'dayjs';
import Notification from '../../../components/Notification';

function NewCharacter() {
  const isSmallScreen = useMediaQuery('(max-width:830px)');
  const notification = useRef();
  const [activeStep, setActiveStep] = useState(0);
  const [characterData, setCharacterData] = useState({
    name: '',
    class: 1,
    race: 0,
    gender: 0,
    birthday: null,
    age: 16,
    height: 100,
    weight: 30,
    perkPoints: 100,
    strength: 0,
    stamina: 0,
    endurance: 30,
    wealth: 0,
    skin: null,
    vehicle: null,
  });

  const sendNotification = (type, title, desc) => {
    notification.current.handleNotification(type, title, desc);
  };

  const characterSteps = [
    {
      label: 'Dane osobowe',
      component: <PersonalData characterData={characterData} setCharacterData={setCharacterData} setActiveStep={setActiveStep} sendNotification={sendNotification} />,
    },
    {
      label: 'Wygląd',
      component: <Skin characterData={characterData} setCharacterData={setCharacterData} setActiveStep={setActiveStep} sendNotification={sendNotification} />,
    },
    {
      label: 'Pojazd',
      component: <Vehicle characterData={characterData} setCharacterData={setCharacterData} setActiveStep={setActiveStep} sendNotification={sendNotification} />,
    },
    {
      label: 'Informacje',
      component: <DataSummary characterData={characterData} setActiveStep={setActiveStep} sendNotification={sendNotification}/>,
    },
  ];

  if (isSmallScreen) {
    return (
      <Container>
        <Notification ref={notification} />
        <Card elevation={0}>
          <CardContent>
            <Stepper activeStep={activeStep} orientation='vertical'>
              {characterSteps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>{step.component}</StepContent>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center' }}>
      <Notification ref={notification} />
      <Card sx={{ minWidth: '800px', marginBottom:'33px' }} elevation={0}>
        <CardContent>
          <Stepper activeStep={activeStep}>
            {characterSteps.map((step, index) => (
              <Step key={index}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Stack mt={4}>{characterSteps[activeStep].component}</Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

export default NewCharacter;
