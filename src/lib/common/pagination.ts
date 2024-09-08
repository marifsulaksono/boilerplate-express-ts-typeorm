export default function metaPagination(page: number, limit: number, total: number) {
    return {
        page: page,
        offset: ((page - 1) * limit) + 1,
        limit: limit,
        total: total
    }
}