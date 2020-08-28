import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const password = await hashPassword(args.data.password)
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        })

        return {
            user,
            token: generateToken(user.id)
        }
    },
    async login(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })

        if (!user) {
            throw new Error('Unable to login')
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login')
        }

        return {
            user,
            token: generateToken(user.id)
        }
    },
    async deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info)
    },
    async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        if (typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password)
        }

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info)
    },
    async createTournament(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const tournament = await prisma.mutation.createTournament({
            data: {
                ...args.data,
                creator: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info)

        return tournament
    },
    async createMatch(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const tournamentExists = await prisma.exists.Tournament({
            id: args.data.tournament,
            creator: {
                id: userId
            }
        })

        if (!tournamentExists) {
            throw new Error("Tournament not found or you aren't the tournament creator")
        }

        return prisma.mutation.createMatch({
            data: {
                tournament: {
                    connect: {
                        id: args.data.tournament
                    }
                }
            }
        }, info)
    },
    async createPlayer(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const userIsAdmin = await prisma.exists.User({
            id: userId,
            role: 'ADMIN'
        })

        if (!userIsAdmin) {
            throw new Error("Only admin can create new players")
        }

        return prisma.mutation.createPlayer({
            data: args.data
        }, info)
    }
}

export { Mutation as default }