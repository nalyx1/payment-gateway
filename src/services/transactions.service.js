import prisma from '../database/prisma';
import { v4 as uuidv4 } from 'uuid'; 
import PagarMeProvider from '../providers/pagarme.provider';

class TransactionService {
    payment_provider;
    
    constructor(paymentProvider) {
        this.payment_provider = paymentProvider || PagarMeProvider
    }

    async process({
        cartCode,
        paymentType,
        installments,
        customer,
        billing,
        creditCard
    }) {
        try {
            const cart = await prisma.cart.findUnique({
                where: {
                    code: cartCode,
                }
            })

            if(!cart) {
                throw new Error(`Cart ${cartCode} not found`)
            }

            const transaction = await prisma.transaction.create({
                data: {
                    cartCode: cart.code,
                    code: await uuidv4(),
                    total: cart.price,
                    paymentType,
                    installments,
                    status: "STARTED",
                    customerName: customer.name,
                    customerEmail: customer.email,
                    customerMobile: customer.mobile,
                    customerDocument: customer.document,
                    billingAddress: billing.address,
                    billingNumber: billing.number,
                    billingNeighborhood: billing.neighborhood,
                    billingCity: billing.city,
                    billingState: billing.state,
                    billingZipCode: billing.zipCode              
                }
            })

            this.payment_provider.process({
                transactionCode: transaction.code,
                total: transaction.total,
                paymentType,
                installments,
                creditCard,
                customer,
                billing,
            })

            return transaction;
        } catch (error) {
            console.error(error)
            return error;
        }
    }
}

export default new TransactionService();
