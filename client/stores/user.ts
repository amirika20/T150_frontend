import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { BodyT, fetchy } from "@/utils/fetchy";

export const useUserStore = defineStore(
  "user",
  () => {
    const currentUsername = ref("");

    const currentSide = ref("");

    const currentUserProfilePhoto = ref("");

    const isLoggedIn = computed(() => currentUsername.value !== "");

    const currentFriends = ref(new Array<string>());

    const resetStore = () => {
      currentUsername.value = "";
      currentUserProfilePhoto.value = "";
    };

    const createUser = async (username: string, password: string, code: string, profilePhoto: string, side: string) => {
      await fetchy("/api/users", "POST", {
        body: { username: username, password: password, profilePhoto: profilePhoto, code: code, side },
      });
    };

    const loginUser = async (username: string, password: string) => {
      console.log("Here store");
      await fetchy("/api/login", "POST", {
        body: { username: username, password: password },
      });
    };

    const updateSession = async () => {
      try {
        const { username, profilePhoto, side } = await fetchy("/api/session", "GET", { alert: false });
        currentUsername.value = username;
        currentUserProfilePhoto.value = profilePhoto;
        currentSide.value = side;
      } catch (_) {
        console.log(_);
        currentUsername.value = "";
        currentUserProfilePhoto.value = "";
        currentSide.value = "";
      }
    };

    const logoutUser = async () => {
      await fetchy("/api/logout", "POST");
      resetStore();
    };

    const updateUser = async (patch: BodyT) => {
      await fetchy("/api/users", "PATCH", { body: { update: patch } });
    };

    const deleteUser = async () => {
      await fetchy("/api/users", "DELETE");
      resetStore();
    };

    return {
      currentUsername,
      currentUserProfilePhoto,
      isLoggedIn,
      currentFriends,
      currentSide,
      createUser,
      loginUser,
      updateSession,
      logoutUser,
      updateUser,
      deleteUser,
    };
  },
  { persist: true },
);
