import React, { useState } from "react";
import Modal from "react-modal";
import InputMask from "react-input-mask";
import axios from "axios";
import toast from "react-hot-toast";
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
  cep: yup
    .string()
    .test("len", "CPF inválido", (val) => val.length === 9)
    .required("O Cep é obrigatório."),
  addressNumber: yup
    .number("Favor, informar apenas números")
    .positive("O número não pode ser negativo ou igual à zero.")
    .required("O número é obrigatório.")
    .typeError("Inserir apenas números e o campo não pode ser vazio"),
  street: yup.string().trim().required("O endereço é obrigatório."),
  complement: yup.string().trim(),
  district: yup.string().trim().required("O setor é obrigatório."),
  city: yup.string().trim().required("O nome da cidade é obrigatório."),
  state: yup.string().trim().required("O nome do estado é obrigatório."),
});

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "25%",
    bottom: "5%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
export const ModalUpdate = ({ open, closed, updateData }) => {
  const [cep, setCep] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { user } = updateData;

  const { address } = updateData;

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

  async function onSubmit(data) {
    try {
      const resp = await axios.put(
        `https://6157ba858f7ea600179852ad.mockapi.io/api/v1/iclinic/${updateData.id}`,
        data
      );
      toast.success(
        "Clínica cadastrada com sucesso. Você será redirecionado para a listagem de clínicas",
        {
          position: "top-center",
        }
      );
      console.log(resp);
    } catch (err) {
      toast.error("Não foi possivel cadastrar a clínica", {
        position: "top-center",
      });
    }
    console.log("Data", data);
  }

  return (
    <Modal
      isOpen={open}
      onRequestClose={closed}
      contentLabel="My dialog"
      ariaHideApp={false}
      style={customStyles}
    >
      <S.Container data-aos="zoom-in">
        <S.ContainerHeader>
          <h2>Atualizar Clínica</h2>
        </S.ContainerHeader>
        <S.ContainerForm onSubmit={handleSubmit(onSubmit)}>
          <S.ContainerFormItem>
            <label>Nome da clínica</label>
            <input defaultValue={user?.name} {...register("name")} />
            <p>{errors.name?.message}</p>
          </S.ContainerFormItem>
          <S.ContainerFormItem>
            <label>CPF do responsável</label>
            <InputMask
              defaultValue={user?.cpf}
              {...register("cpf")}
              mask={"999.999.999-99"}
              maskChar=""
            ></InputMask>
            <p>{errors.cpf?.message}</p>
          </S.ContainerFormItem>
          <S.ContainerFormItem>
            <label>Capital social</label>
            <input defaultValue={user?.capital} {...register("capital")} />
            <p>{errors.capital?.message}</p>
          </S.ContainerFormItem>

          <S.ContainerFormRow>
            <S.ContainerFormItem>
              <label>CEP</label>
              <InputMask
                defaultValue={address?.cep}
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
                defaultValue={address?.addressNumber}
                {...register("addressNumber")}
              />
              <p>{errors.addressNumber?.message}</p>
            </S.ContainerFormItem>
          </S.ContainerFormRow>
          <S.ContainerFormItemAddress>
            <label>Endereço</label>
            <input defaultValue={address?.street} {...register("street")} />
            <p>{errors.street?.message}</p>
          </S.ContainerFormItemAddress>
          <S.ContainerFormRow>
            <S.ContainerFormItem>
              <label>Complemento</label>
              <input
                defaultValue={address?.complement}
                {...register("complement")}
              />
            </S.ContainerFormItem>
            <S.ContainerFormItem>
              <label>Bairro</label>
              <input
                defaultValue={address?.district}
                {...register("district")}
              />
              <p>{errors.district?.message}</p>
            </S.ContainerFormItem>
          </S.ContainerFormRow>
          <S.ContainerFormRow>
            <S.ContainerFormItem>
              <label>Cidade</label>
              <input defaultValue={address?.city} {...register("city")} />
              <p>{errors.city?.message}</p>
            </S.ContainerFormItem>
            <S.ContainerFormItem>
              <label>Estado</label>
              <input defaultValue={address?.state} {...register("state")} />
              <p>{errors.state?.message}</p>
            </S.ContainerFormItem>
          </S.ContainerFormRow>
          <S.ContainerSubmit>
            <S.ButtonBack middle onClick={closed}>
              Retornar
            </S.ButtonBack>
            <S.ButtonAdvanced type="submit" value="Salvar" />
          </S.ContainerSubmit>
        </S.ContainerForm>
      </S.Container>
      {console.log(updateData)}
    </Modal>
  );
};
