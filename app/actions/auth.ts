"use server";


import { signIn,signOut } from "@/auth";

export const loginWithGithubBtn = async () => {
  await signIn("github", { redirectTo: "/dashboard" });
};

export const loginWithGoogleBtn = async () => {
  await signIn("google", { redirectTo: "/dashboard" });
};


export const logout = async () => {
  await signOut({
    redirectTo:'/'
  })
}