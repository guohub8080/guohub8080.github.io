import byDefault from "@/utils/byDefault.ts";
import React from "react";
import toast from "react-hot-toast";
import {AiFillWarning} from "react-icons/ai";
import googleColors from "@/assets/colors/googleColors";

const warningToast = (title: string, duration?: number) => toast(title,
	{
		duration: byDefault(duration, 5000),
		icon: <AiFillWarning color={googleColors.red300}/>, style: {
			boxShadow: "0 0 10px rgba(0,0,0,0.05)",
		}
	})

export default warningToast;
