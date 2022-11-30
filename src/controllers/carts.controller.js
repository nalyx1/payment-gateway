import prisma from '../database/prisma'

class CartsController {
    async findAll(request, response) {
        try {
            const carts = await prisma.cart.findMany()
            return response.status(200).send({ status: 200, carts: carts })
        } catch (error) {
            console.log(error)
            return response.status(500).send({ status: 500, error: error})
        }
    }

    async create(request, response) {
        try {
            const { code, price } = request.body;
            if(!code || !price) {
                return response.status(400).send({ status: 400, error: `Informe todos os parametros`})
            }

            const cart = await prisma.cart.create({
                data: {
                    code,
                    price,
                }
            })
            return response.status(201).send({ status: 201, message: cart})
        } catch (error) {
            console.log(error)
            return response.status(500).send({ status: 500, error: error})
        }
    }

    async update(request, response) {
        try {
            const { id } = request.params;
            const { code, price } = request.body;
            if(!id || !code || !price) {
                return response.status(400).send({ status: 400, error: `Informe todos os parametros`})
            }

            const cart = await prisma.cart.update({
                data: {
                    code,
                    price,
                },
                where: {
                    id,
                }
            })
            if(!cart) {
                return response.status(400).send({ status: 400, error: `Carrinho não encontrado`})
            }

            return response.status(200).send({ status: 200, message: cart})
        } catch (error) {
            console.log(error)
            return response.status(500).send({ status: 500, error: error})
        }
    }

    async delete(request, response) {
        try {
            const { id } = request.params;
            if(!id) {
                return response.status(400).send({ status: 400, message: `Informe o id`})
            }

            await prisma.cart.delete({
                where: {
                    id,
                }
            })

            return response.status(204).send()
        } catch (error) {
            console.log(error)
            return response.status(500).send({ status: 500, error: error})
        }
    }
}

export default new CartsController();