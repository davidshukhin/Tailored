import React, { useState } from "react";
import { useStripeConnect } from "../hooks/useStripeConnect";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";