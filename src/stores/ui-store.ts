import { create } from "zustand";

type ComposerType = "post" | "reply" | "quote" | "edit";
type ModalName = "none" | "composer" | "confirm";

interface UiState {
  composerType: ComposerType;
  composerPostId?: string;
  isComposerOpen: boolean;
  isMobileNavigationOpen: boolean;
  activeModal: ModalName;
  sharedDraft: string;
  openComposer: (composerType?: ComposerType, options?: { postId?: string }) => void;
  closeComposer: () => void;
  setMobileNavigationOpen: (isOpen: boolean) => void;
  setActiveModal: (modal: ModalName) => void;
  setSharedDraft: (draft: string) => void;
  resetUiState: () => void;
}

const initialState = {
  composerType: "post" as ComposerType,
  composerPostId: undefined,
  isComposerOpen: false,
  isMobileNavigationOpen: false,
  activeModal: "none" as ModalName,
  sharedDraft: "",
};

export const useUiStore = create<UiState>((set) => ({
  ...initialState,
  openComposer: (composerType = "post", options) =>
    set({
      composerType,
      composerPostId: options?.postId,
      isComposerOpen: true,
      activeModal: "composer",
    }),
  closeComposer: () =>
    set({
      composerPostId: undefined,
      isComposerOpen: false,
      activeModal: "none",
    }),
  setMobileNavigationOpen: (isMobileNavigationOpen) => set({ isMobileNavigationOpen }),
  setActiveModal: (activeModal) => set({ activeModal }),
  setSharedDraft: (sharedDraft) => set({ sharedDraft }),
  resetUiState: () => set(initialState),
}));
