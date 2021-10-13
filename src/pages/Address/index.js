/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import InputMask from "react-input-mask";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import * as S from "./styles";

const schema = yup.object({
  cep: yup
    .string()
    .test("len", "CPF inválido", (val) => val.length === 9)
    .required("O Cep é obrigatório."),
  addressNumber: yup
    .string()
    .trim()
    .required("O número do endereço é obrigatório.")
    .typeError("O campo não pode ser vazio"),
  street: yup.string().trim().required("O endereço é obrigatório."),
  complement: yup.string().trim(),
  district: yup.string().trim().required("O setor é obrigatório."),
  city: yup.string().trim().required("O nome da cidade é obrigatório."),
  state: yup.string().trim().required("O nome do estado é obrigatório."),
});

export default function Address() {
  const history = useHistory();
  const [cep, setCep] = useState("");

  const [userData] = useState(() => {
    return JSON.parse(localStorage.getItem("Infos"));
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const defaultInitial = {
    cep: userData?.address?.cep,
    addressNumber: userData?.address?.addressNumber,
    street: userData?.address?.street,
    complement: userData?.address?.complement,
    district: userData?.address?.district,
    city: userData?.address?.city,
    state: userData?.address?.state,
  };

  async function postB() {
    try {
      const resp = await axios(`https://viacep.com.br/ws/${cep}/json/`);
      console.log(resp);
      if (resp?.data?.erro) {
        toast.error("Cep invalido.");
      } else {
        setValue("street", resp.data.logradouro);
        setValue("complement", resp.data.complemento);
        setValue("district", resp.data.bairro);
        setValue("city", resp.data.localidade);
        setValue("state", resp.data.uf);
        toast.success("Endereço encontrado");
      }
    } catch (err) {}
  }

  function goBack() {
    history.push("/register");
  }

  function onSubmit(address) {
    localStorage.setItem("Infos", JSON.stringify({ ...userData, address }));
    history.push("/checkout");
  }

  return (
    <S.Container data-aos="zoom-in">
      <S.ContainerHeader>
        <h2>Endereço da Clínica</h2>
      </S.ContainerHeader>
      <S.ContainerForm onSubmit={handleSubmit(onSubmit)}>
        <S.ContainerFormRow>
          <S.ContainerFormItem>
            <label>CEP</label>
            <InputMask
              defaultValue={defaultInitial?.cep}
              {...register("cep", {
                onBlur: postB,
              })}
              onChange={(e) => setCep(e.target.value)}
              mask="99999-999"
              maskChar=""
            ></InputMask>
            <p>{errors.cep?.message}</p>
          </S.ContainerFormItem>
          <S.ContainerFormItem>
            <label>Número</label>
            <input
              defaultValue={defaultInitial?.addressNumber}
              {...register("addressNumber")}
            />
            <p>{errors.addressNumber?.message}</p>
          </S.ContainerFormItem>
        </S.ContainerFormRow>
        <S.ContainerFormItemAddress>
          <label>Endereço</label>
          <input
            defaultValue={defaultInitial?.street}
            {...register("street")}
          />
          <p>{errors.street?.message}</p>
        </S.ContainerFormItemAddress>
        <S.ContainerFormRow>
          <S.ContainerFormItem>
            <label>Complemento</label>
            <input
              defaultValue={defaultInitial?.complement}
              {...register("complement")}
            />
          </S.ContainerFormItem>
          <S.ContainerFormItem>
            <label>Bairro</label>
            <input
              defaultValue={defaultInitial?.district}
              {...register("district")}
            />
            <p>{errors.district?.message}</p>
          </S.ContainerFormItem>
        </S.ContainerFormRow>
        <S.ContainerFormRow>
          <S.ContainerFormItem>
            <label>Cidade</label>
            <input defaultValue={defaultInitial?.city} {...register("city")} />
            <p>{errors.city?.message}</p>
          </S.ContainerFormItem>
          <S.ContainerFormItem>
            <label>Estado</label>
            <input
              defaultValue={defaultInitial?.state}
              {...register("state")}
            />
            <p>{errors.state?.message}</p>
          </S.ContainerFormItem>
        </S.ContainerFormRow>
        <S.ContainerSubmit>
          <S.ButtonBack middle onClick={goBack}>
            Retornar
          </S.ButtonBack>
          <S.ButtonAdvanced type="submit" value="Avançar" />
        </S.ContainerSubmit>
      </S.ContainerForm>
    </S.Container>
  );
}
