import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import InputMask from "react-input-mask";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import * as S from "./styles";

const schema = yup.object({
  name: yup.string().trim().required("O nome da clínica é obrigatório."),
  cpf: yup
    .string()
    .test("len", "CPF inválido", (val) => val.length === 14)
    .required("O CPF é obrigatório."),
  capital: yup
    .number("Favor, informar apenas números")
    .positive("O Capital social não pode ser negativo ou igual à zero.")
    .required("O Capital social é obrigatório.")
    .typeError(
      "Nesse campo, inserir apenas números e o campo não pode ser vazio"
    ),
});

export default function Register() {
  const history = useHistory();

  const [userData] = useState(() => {
    return JSON.parse(localStorage.getItem("Infos"));
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const defaultInitial = {
    name: userData?.user?.name,
    cpf: userData?.user?.cpf,
    capital: userData?.user?.capital,
  };

  function onSubmit(user) {
    localStorage.setItem("Infos", JSON.stringify({ ...userData, user }));
    history.push("/address");
  }

  return (
    <S.Container data-aos="zoom-in">
      <S.ContainerHeader>
        <h2>Dados Financeiros da Clínica</h2>
      </S.ContainerHeader>
      <S.ContainerForm onSubmit={handleSubmit(onSubmit)}>
        <S.ContainerFormItem>
          <label>Nome da clínica</label>
          <input defaultValue={defaultInitial?.name} {...register("name")} />
          <p>{errors.name?.message}</p>
        </S.ContainerFormItem>
        <S.ContainerFormItem>
          <label>CPF do responsável</label>
          <InputMask
            defaultValue={defaultInitial?.cpf}
            {...register("cpf")}
            mask={"999.999.999-99"}
            maskChar=""
          ></InputMask>
          <p>{errors.cpf?.message}</p>
        </S.ContainerFormItem>
        <S.ContainerFormItem>
          <label>Capital social</label>
          <input
            defaultValue={defaultInitial?.capital}
            {...register("capital")}
          />
          <p>{errors.capital?.message}</p>
        </S.ContainerFormItem>
        <S.ContainerSubmit>
          <S.ButtonAdvanced type="submit" value="Avançar" />
        </S.ContainerSubmit>
      </S.ContainerForm>
    </S.Container>
  );
}
