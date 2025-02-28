import React from "react";
import { Center, Loader, Text } from "@mantine/core";
import { useTheme } from "@mui/material/styles";
const LoaderComponent = () => {
  const theme = useTheme();
  return (
    <Center style={{ height: "70vh", flexDirection: "column" }}>
      <Loader size="lg" variant="bars" color={theme.palette.button.main} />
      <Text mt="md" color="gray" size="lg">
        Loading, please wait...
      </Text>
    </Center>
  );
};

export default LoaderComponent;
