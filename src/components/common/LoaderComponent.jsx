import React from "react";
import { Center, Loader, Text } from "@mantine/core";

const LoaderComponent = () => {
  return (
    <Center style={{ height: "70vh", flexDirection: "column" }}>
      <Loader size="lg" variant="bars" color="blue" />
      <Text mt="md" color="gray" size="lg">
        Loading, please wait...
      </Text>
    </Center>
  );
};

export default LoaderComponent;
