import dayjs from "dayjs";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import { and, sql,lte,count, gte, eq } from "drizzle-orm";

export async function getWeekPendingGoals(){
    const fistDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCreatUpToWeek = db.$with('goals_creat_up_to_week').as(
        db.select({
            id: goals.id,
            title: goals.title,
            desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
            createdAt: goals.createdAt,
        }).from(goals).where(lte(goals.createdAt,lastDayOfWeek))
    )

    const goalCompletionCounts = db.$with('goals_completion_counts').as(
        db.select({
            goalId: goalCompletions.goalId,
            completionCount: count(goalCompletions.id).as('completionCount'),
        }).from(goalCompletions).where(and(
            gte(goalCompletions.createdAt,fistDayOfWeek),
            lte(goalCompletions.createdAt,lastDayOfWeek)
        )).groupBy(goalCompletions.goalId)
    )

    const pedingGoals = await db
        .with(goalsCreatUpToWeek,goalCompletionCounts)
        .select({
            id: goalsCreatUpToWeek.id,
            title: goalsCreatUpToWeek.title,
            desiredWeeklyFrequency: goalsCreatUpToWeek.desiredWeeklyFrequency,
            completionCount: sql`
            COALESCE(${goalCompletionCounts.completionCount},0)
            `.mapWith(Number),
        })
        .from(goalsCreatUpToWeek)
        .leftJoin(goalCompletionCounts,eq(goalCompletionCounts.goalId,goalsCreatUpToWeek.id))

    return { pedingGoals }
}