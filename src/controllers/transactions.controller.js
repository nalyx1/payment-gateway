import * as yup from 'yup'
import parsePhoneNumber from 'libphonenumber-js'
import { cpf, cnpj } from 'cpf-cnpj-validator'
import prisma from '../database/prisma'

import TransactionsService from '../services/transactions.service'

class TransactionsController {
    async create(request, response) {
        try {
            const {
                cartCode,
                paymentType,
                installments,
                customerName,
                customerEmail,
                customerMobile,
                customerDocument,
                billingAddress,
                billingNumber,
                billingNeighborhood,
                billingCity,
                billingState,
                billingZipCode,
                creditCardNumber,
                creditCardExpiration,
                creditCardHolderName,
                creditCardCvv
            } = request.body

            const schema = yup.object({
                cartCode: yup.string().required(),
                paymentType: yup.mixed().oneOf(['BILLET', 'CREDIT_CARD']),
                installments: yup.number().min(1).when("paymentType", (paymentType, schema) =>
                    paymentType === "CREDIT_CARD" ? schema.max(12) : schema.max(1)),
                customerName: yup.string().required().min(3),
                customerEmail: yup.string().required().email(),
                customerMobile: yup.string().required().test("is-valid-mobile", "${path} is not a mobile number", value => 
                    parsePhoneNumber(value, "BR").isValid()),
                customerDocument: yup.string().required().test("is-valid-document", "${path} is not a valid document", value => cpf.isValid(value) || cnpj.isValid(value)),
                billingAddress: yup.string().required(),
                billingNumber: yup.string().required(),
                billingNeighborhood: yup.string().required(),
                billingCity: yup.string().required(),
                billingState: yup.string().required(),
                billingZipCode: yup.string().required(),
                creditCardNumber: yup.string().min(13).max(19).when("paymentType", (paymentTypes, schema) => paymentType === "CREDIT_CARD" ? schema.required() : schema),
                creditCardExpiration: yup.string().min(5).max(5).when("paymentType", (paymentTypes, schema) => paymentType === "CREDIT_CARD" ? schema.required() : schema),
                creditCardHolderName: yup.string().min(3).when("paymentType", (paymentTypes, schema) => paymentType === "CREDIT_CARD" ? schema.required() : schema),
                creditCardCvv: yup.string().min(3).max(3).when("paymentType", (paymentTypes, schema) => paymentType === "CREDIT_CARD" ? schema.required() : schema)
            })

            if(!(await schema.isValid(request.body))) {
                return response.status(400).send({ error: `Error on validate schema`})
            }

            const cart = await prisma.cart.findUnique({
                where: {
                    code: cartCode
                }
            })

            if(!cart) {
                return response.status(404).send()
            }

            const transaction = await TransactionsService.process({
                cartCode,
                paymentType,
                installments,
                customer: {
                    name: customerName,
                    email: customerEmail,
                    mobile: customerMobile,
                    document: customerDocument
                },
                billing: {
                    address: billingAddress,
                    number: billingNumber,
                    neighborhood: billingNeighborhood,
                    city: billingCity,
                    state: billingState,
                    zipCode: billingZipCode
                },
                creditCard: {
                    number: creditCardNumber,
                    expiration: creditCardExpiration,
                    cvv: creditCardCvv,
                    holderName: creditCardHolderName
                }
            });

            return response.status(200).send(transaction)
        } catch (error) {
            console.error(error)
            return response.status(500).send({ status: 500, error: `Internal Server Error` })
        }
    }
}

export default new TransactionsController();