import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import * as S from "./styles";

export default function Checkout() {
  const history = useHistory();

  const [sendValue, setSendValue] = useState(false);

  const [data] = useState(() => {
    return JSON.parse(localStorage.getItem("Infos"));
  });

  const { user } = data;
  const { address } = data;

  async function registerClinic() {
    try {
      const resp = await axios.post(
        `https://6157ba858f7ea600179852ad.mockapi.io/api/v1/iclinic`,
        data
      );

      toast.success(
        "Clínica cadastrada com sucesso. Você será redirecionado para a listagem de clínicas",
        {
          position: "top-center",
        }
      );
      setSendValue(true);
      console.log(resp);
      localStorage.removeItem("Infos");
      setTimeout(function () {
        history.push("/clinics");
      }, 3000);
    } catch (err) {
      toast.error("Não foi possivel cadastrar a clínica", {
        position: "top-center",
      });
      setSendValue(false);
    }
  }

  function goBack() {
    history.push("/address");
  }

  return (
    <S.Container data-aos="zoom-in">
      <S.ContainerHeader>
        <h2>Confirmar Dados</h2>
      </S.ContainerHeader>
      <S.ContainerForm>
        <S.ContainerType>
          <h3>Informações financeiras</h3>
          <S.ContainerFormItemRow>
            <label>Nome:</label>
            <span>{user.name}</span>
          </S.ContainerFormItemRow>
          <S.ContainerFormItemRow>
            <label>CPF:</label>
            <span>{user.cpf}</span>
          </S.ContainerFormItemRow>
          <S.ContainerFormItemRow>
            <label>Capital Social:</label>
            <span>
              {user.capital.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </S.ContainerFormItemRow>
        </S.ContainerType>

        <S.ContainerType>
          <h3>Localidade</h3>
          <S.ContainerFormRow>
            <S.ContainerFormItem>
              <label>CEP:</label>
              <span>{address?.cep}</span>
            </S.ContainerFormItem>
            <S.ContainerFormItem>
              <label>Número:</label>
              <span>{address?.addressNumber}</span>
            </S.ContainerFormItem>
          </S.ContainerFormRow>
          <S.ContainerFormItemRow>
            <label>Endereço:</label>
            <span>{address?.street}</span>
          </S.ContainerFormItemRow>
          <S.ContainerFormRow>
            <S.ContainerFormItem>
              <label>Complemento:</label>
              <span>{address?.complement}</span>
            </S.ContainerFormItem>
            <S.ContainerFormItem>
              <label>Bairro:</label>
              <span>{address?.district}</span>
            </S.ContainerFormItem>
          </S.ContainerFormRow>
          <S.ContainerFormRow>
            <S.ContainerFormItem>
              <label>Cidade:</label>
              <span>{address?.city}</span>
            </S.ContainerFormItem>
            <S.ContainerFormItem>
              <label>Estado:</label>
              <span>{address?.state}</span>
            </S.ContainerFormItem>
          </S.ContainerFormRow>
        </S.ContainerType>

        <S.ContainerSubmit>
          <S.ButtonBack middle onClick={goBack}>
            Retornar
          </S.ButtonBack>
          <S.ButtonAdvanced
            onClick={registerClinic}
            disabled={sendValue === true}
          >
            Cadastrar
          </S.ButtonAdvanced>
        </S.ContainerSubmit>
      </S.ContainerForm>
    </S.Container>
  );
}
