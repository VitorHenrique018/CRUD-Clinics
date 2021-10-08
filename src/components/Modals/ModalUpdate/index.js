import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export const ModalUpdate = ({ open, closed, updateData }) => (
  <Modal
    isOpen={open}
    onRequestClose={closed}
    contentLabel="My dialog"
    ariaHideApp={false}
    style={customStyles}
  >
    <div>Atualizar Clinica</div>
    <button onClick={closed}>Voltar</button>
    <button onClick={closed}>Salvar</button>

    {console.log(updateData)}
  </Modal>
);
