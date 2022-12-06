import { cpf } from 'cpf-cnpj-validator'
import 'dotenv/config'

class PagarMeProvider {
    async process({
        transactionCode,
        total,
        paymentType,
        installments,
        creditCard,
        customer,
        billing,
        items,
    }) {
        try {
            const billetParams = {
                payment_method: 'boleto',
                amount: total * 100,
                installments: 1,
            }

            const creditCardParams = {
                payment_method: 'credit_card',
                amount: total * 100,
                installments: installments,
                card_number: creditCard.number.replace(/[^?0-9]/g, ''),
                card_expiration_data: creditCard.expiration.replace(/[^?0-9]/g, ''),
                card_cvv: creditCard.cvv,
                capture: true,
            }
            
            let paymentParams;

            switch(paymentType) {
                case 'CREDIT_CARD':
                    paymentParams = creditCardParams;
                    break;
                
                case 'BILLET':
                    paymentParams = billetParams;
                    break;
                
                default:
                    throw new Error('Invalid payment type')
                    
            }

            const customerParams = {
                customer: {
                    external_id: customer.email,
                    name: customer.name,
                    email: customer.email,
                    type: cpf.isValid(customer.document) ? 'individual' : 'corporation',
                    country: 'br',
                    phone_numbers: [customer.mobile],
                    documents: [
                        {
                            type: cpf.isValid(customer.document) ? 'cpf' : 'cnpj',
                            number: customer.document.replace(/[^?0-9]/g, '')

                        }
                    ]
                }
            }

            const billingParams = billing?.zipCode ? {
                billing: {
                    name: 'Billing Address',
                    address: {
                        country: 'br',  
                        state: billing.state,
                        city: billing.city,
                        neighborhood: billing.neighborhood,
                        street: billing.address,
                        street_number: billing.number,
                        zipcode: billing.zipCode.replace(/[^?0-9]/g, ''),
                    }
                }
            } : {};

            const itemsParams = items && items.lenght > 0 ? {
                items: items.map((item) => ({
                    id: item?.id.toString(),
                    title: item?.title,
                    unit_price: item?.amount * 100,
                    quantity: item?.quantity || 1,
                    tangible: false,
                }))
            } : {
                items: [
                    {
                        id: "1",
                        title: `t-${transactionCode}`,
                        unit_price: total * 100,
                        quantity: 1,
                        tangible: false,
                    }
                ]
            }

            const metadataParams = {
                metadata: {
                    transaction_code: transactionCode,
                },
            }

            const transactionParams = {
                async: false,
                // postback_url: '',
                ...paymentParams,
                ...customerParams,
                ...billingParams,
                ...itemsParams,
                ...metadataParams
            }
            


        } catch (error) {
            console.error(error)
            return error;
        }
    }
}

export default new PagarMeProvider();