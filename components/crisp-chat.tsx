"use client"

import { useEffect } from "react"
import {Crisp} from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("184c290f-6fc0-4619-9bba-855bb0a42904")
    }, []);

    return null;
}