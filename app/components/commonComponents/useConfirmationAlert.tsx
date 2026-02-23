import React, { useMemo, useState } from "react";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";

type AlertButton = {
  text?: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
};

type AlertOptions = {
  cancelable?: boolean;
};

type ModalState = {
  isVisible: boolean;
  title: string;
  message: string;
  submitText: string;
  cancelText: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  isDestructive: boolean;
  cancelable: boolean;
};

const DEFAULT_STATE: ModalState = {
  isVisible: false,
  title: "",
  message: "",
  submitText: "OK",
  cancelText: "",
  onSubmit: undefined,
  onCancel: undefined,
  isDestructive: false,
  cancelable: true,
};

export default function useConfirmationAlert() {
  const [modalState, setModalState] = useState<ModalState>(DEFAULT_STATE);

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isVisible: false }));
  };

  const showAlert = (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: AlertOptions
  ) => {
    const normalizedButtons =
      buttons && buttons.length > 0 ? buttons : [{ text: "OK" }];

    const cancelButton =
      normalizedButtons.find((b) => b.style === "cancel") ||
      (normalizedButtons.length > 1 ? normalizedButtons[0] : undefined);
    const submitButton =
      normalizedButtons.find((b) => b.style === "destructive") ||
      normalizedButtons[normalizedButtons.length - 1];

    setModalState({
      isVisible: true,
      title,
      message: message || "",
      submitText: submitButton?.text || "OK",
      cancelText: cancelButton && cancelButton !== submitButton ? cancelButton.text || "Cancel" : "",
      onSubmit: submitButton?.onPress,
      onCancel: cancelButton?.onPress,
      isDestructive: submitButton?.style === "destructive",
      cancelable: options?.cancelable !== false,
    });
  };

  const confirmationModal = useMemo(
    () => (
      <ConfirmationModal
        isModalVisible={modalState.isVisible}
        onClose={modalState.cancelable ? closeModal : () => {}}
        title={modalState.title}
        text={modalState.message}
        submitText={modalState.submitText}
        cancelText={modalState.cancelText}
        isDestructive={modalState.isDestructive}
        handleSubmit={() => {
          const onSubmit = modalState.onSubmit;
          closeModal();
          if (onSubmit) onSubmit();
        }}
        handleCancel={() => {
          const onCancel = modalState.onCancel;
          closeModal();
          if (onCancel) onCancel();
        }}
        disabled={!modalState.cancelable}
      />
    ),
    [modalState]
  );

  return { showAlert, confirmationModal };
}

