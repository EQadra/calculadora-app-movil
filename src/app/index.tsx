import React, { useState } from "react";
import {
  View,
} from "react-native";
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/auth/login" />;
}
