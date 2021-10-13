import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ModalUpdate } from "../../components/Modals/ModalUpdate";

import * as S from "./styles";

export default function Clinics() {
  const [data, setDate] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updateData, setUpdateData] = useState([]);

  useEffect(() => {
    listClinics();
  }, []);

  async function listClinics() {
    try {
      const resp = await axios(
        `https://6157ba858f7ea600179852ad.mockapi.io/api/v1/iclinic`
      );
      if (resp.data.length > 0) {
        setDate(resp.data);
      }
    } catch (err) {}
  }

  async function deleteClinic(id) {
    try {
      const resp = await axios.delete(
        `https://6157ba858f7ea600179852ad.mockapi.io/api/v1/iclinic/${id}`
      );
      if (resp) {
        toast.success("Clínica excluída com sucesso.", {
          position: "top-center",
        });
        listClinics();
      } else {
        toast.error("Não foi possível excluir a clínica", {
          position: "top-center",
        });
      }
    } catch (err) {}
  }

  function openModal(data) {
    setModalIsOpen(true);
    setUpdateData(data);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <S.Container>
      <S.ContainerHeader>
        <h2>Clínicas Cadastradas</h2>
      </S.ContainerHeader>
      {data && (
        <S.ContainerBody>
          {data?.map((index, id) => (
            <S.ContainerBodyItens data-aos="fade-up" key={id}>
              <S.ContainerBodyItensArea data-aos="fade-up">
                <h3>{index?.user?.name}</h3>
                <span>
                  <b>CPF:</b> {index?.user?.cpf}
                </span>
                <span>
                  <b> Capital Social: </b>
                  {index?.user?.capital.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </S.ContainerBodyItensArea>
              <S.ContainerBodyItensAddress data-aos="fade-up">
                <h3>Localidade</h3>
                <span>
                  <b>Endereço:</b> {index?.address?.street}
                </span>
                <span>
                  <b>Número:</b> {index?.address?.addressNumber}
                </span>
                <span>
                  <b>Complemento:</b> {index?.address?.complement}
                </span>
                <span>
                  <b>CEP: </b>
                  {index?.address?.cep}
                </span>
                <span>
                  <b>Bairro:</b> {index?.address?.district}
                </span>
                <span>
                  <b>Cidade:</b> {index?.address?.city}
                </span>
                <span>
                  <b>Estado:</b> {index?.address?.state}
                </span>
              </S.ContainerBodyItensAddress>
              <S.ContainerBodyItensButtons>
                <S.ButtonDelete onClick={() => deleteClinic(index?.id)}>
                  Excluir
                </S.ButtonDelete>
                <S.ButtonEdit onClick={() => openModal(index)}>
                  Atualizar
                </S.ButtonEdit>
              </S.ContainerBodyItensButtons>
            </S.ContainerBodyItens>
          ))}
          {modalIsOpen && (
            <ModalUpdate
              open={modalIsOpen}
              closed={closeModal}
              updateData={updateData}
            />
          )}
        </S.ContainerBody>
      )}
    </S.Container>
  );
}
