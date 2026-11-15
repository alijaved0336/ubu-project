import { Influencers } from "@infrastructure/orm/entities/influencer.entity";
import { InfluencerRepository } from "@infrastructure/orm/reposiories/influencer.repository";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { BUDGET_QUESTIONS_SR_NO, STYLE_QUESTIONS_SR_NO } from "common/constants";
import { Repository } from "typeorm";

export class AiService {
    constructor(
        @InjectRepository(Influencers)
        private readonly influencerRepository: Repository<Influencers>,) { }

    async similarHeightInfluencerRecommendation(consumerData, pageNumber: number, limitNumber: number, userId: number) {

        const url = `${process.env.PYTHON_SERVER_URL}/influencer-recommendation/body/?page=${pageNumber}&page_size=${limitNumber}&isShape=False&isHeight=True`;
        const headers = { 'Content-Type': 'application/json' };
        let final_data = consumerData?.measurement
        if (!final_data)
        {
            return []
        }
        const data2 = {
            "id": userId,
            "scan_id": final_data.scan_id ? final_data.scan_id : 'default_string',
            "body_composition": final_data.bodyComposition,
            "custom_scan_id": null,
            "input": final_data.input,
            "measurements": final_data.measurements,
            "member_id": final_data.memberId ? final_data.memberId : 'key_1234',
            "posture": final_data.posture,
            "created_at": final_data.createdAt ? final_data.createdAt : '2024-01-01T00:00:00',
            "updated_at": final_data.updatedAt ? final_data.updatedAt : '2024-01-02T00:00:00',
        };

        const config = {
            headers,
            timeout: 10000, // 10 seconds timeout

        };

        const response = await axios.post(url, data2, config);
        const response_data = response.data;
        let influencer_ids = Object.keys(response_data.height).map(key => Number(key));
        if (influencer_ids.length > 0)
        {

            const influencers = await this.getRecommendedInfluncerProfileIds(influencer_ids)
            let result = influencers.map(influencer => {
                return {
                    ...influencer,
                    similarity_score: parseFloat(response_data.height[influencer.influencer_id]) * 100
                };
            });
            return result
        }
        return []
    }

    async similarShapeInfluencerRecommendation(consumerData, pageNumber: number, limitNumber: number, userId: number) {
        // Implement similar logic as similarHeightInfluencerRecommendation for shape
        const url = `${process.env.PYTHON_SERVER_URL}/influencer-recommendation/body/?page=${pageNumber}&page_size=${limitNumber}&isShape=True&isHeight=False`;
        const headers = { 'Content-Type': 'application/json' };
        let final_data = consumerData?.measurement
        if (!final_data)
        {
            return []
        }
        const data = {
            id: userId,
            scan_id: final_data.scan_id ? final_data.scan_id : 'default_string',
            body_composition: final_data.bodyComposition,
            custom_scan_id: null,
            input: final_data.input,
            measurements: final_data.measurements,
            member_id: final_data.memberId ? final_data.memberId : 'key_1234',
            posture: final_data.posture,
            created_at: final_data.createdAt ? final_data.createdAt : '2024-01-01T00:00:00',
            updated_at: final_data.updatedAt ? final_data.updatedAt : '2024-01-02T00:00:00',
        };

        const config = {
            headers,
            timeout: 10000, // 10 seconds timeout
        };
        const response = await axios.post(url, data, config);
        const response_data = response.data;


        let influencer_ids = Object.keys(response_data.shape).map(key => Number(key));
        if (influencer_ids.length > 0)
        {

            const influencers = await this.getRecommendedInfluncerProfileIds(influencer_ids)
            let result = influencers.map(influencer => {
                return {
                    ...influencer,
                    similarity_score: parseFloat(response_data.shape[influencer.influencer_id]) * 100
                };
            });
            return result
        }
        return []

    }

    async similarStyleInfluencerRecommendation(consumerData, pageNumber: number, limitNumber: number) {
        try
        {
            const url = `${process.env.PYTHON_SERVER_URL}/recommendation/from-questionnaire/?page=${pageNumber}&page_size=${limitNumber}`;
            const headers = { 'Content-Type': 'application/json' };
            const mappedData = consumerData?.user?.user_answer?.map((user_answer) => {
                if (STYLE_QUESTIONS_SR_NO.includes(user_answer?.question?.sr_no))
                {
                    return {
                        sr_no: user_answer.question.sr_no,
                        question_id: user_answer.question.id,
                        answer: user_answer.selected_options
                    }
                }
                return null;
            }).filter((style) => style !== null)

            if (!mappedData)
            {
                return []
            }
            const data = {
                payload: mappedData
            };

            const config = {
                headers,
                timeout: 10000, // 10 seconds timeout
            };
            const response = await axios.post(url, data, config);
            const response_data = response.data;

            if (Object.keys(response_data).length)
            {
                let user_ids = Object.keys(response_data).map(key => Number(key));

                const influencers = await this.getRecommendedInfluncerProfileById(user_ids)
                let result = influencers.map(influencer => {
                    return {
                        ...influencer,
                        similarity_score: parseFloat(response_data[influencer.user_id])
                    };
                });
                return result
            } else
            {
                console.log("Data not found from AI Server")
                return []
            }
        } catch (error)
        {
            console.log("Error is ", error)
            return []
        }
    }

    async similarBudgetInfluencerRecommendation(consumerData, pageNumber: number, limitNumber: number) {
        // Implement similar logic as similarHeightInfluencerRecommendation for budget
        try
        {
            const url = `${process.env.PYTHON_SERVER_URL}/recommendation/from-questionnaire/?page=${pageNumber}&page_size=${limitNumber}`;
            const headers = { 'Content-Type': 'application/json' };
            const mappedData = consumerData?.user?.user_answer?.map((user_answer) => {
                if (BUDGET_QUESTIONS_SR_NO.includes(user_answer?.question?.sr_no))
                {
                    return {
                        sr_no: user_answer.question.sr_no,
                        question_id: user_answer.question.id,
                        answer: user_answer.selected_options
                    }
                }
                return null;
            }).filter((style) => style !== null)
            if (!mappedData)
            {
                return []
            }
            const data = {
                payload: mappedData
            };

            const config = {
                headers,
                timeout: 10000, // 10 seconds timeout
            };
            const response = await axios.post(url, data, config);
            const response_data = response.data;

            let user_ids = Object.keys(response_data).map(key => Number(key));

            const influencers = await this.getRecommendedInfluncerProfileById(user_ids)
            let result = influencers.map(influencer => {
                return {
                    ...influencer,
                    similarity_score: parseFloat(response_data[influencer.user_id])
                };
            });
            return result
        } catch (error)
        {
            console.log("Error is ::: ", error)
            return []
        }
    }

    async getRecommendedInfluncerProfileBymeasurementId(ids: number[]) {

        return this.influencerRepository
            .createQueryBuilder('influencer')
            .leftJoin('influencer.user', 'user')
            .leftJoin('influencer.measurement', 'measurement')
            .select([
                'influencer.id',
            ])
            .addSelect("influencer.avatar", 'user_avatar')
            .addSelect("measurement.id", 'measurement_id')
            .where('measurement.id IN (:...ids)', { ids })
            .getRawMany();



    }

    async getRecommendedInfluncerProfileIds(ids: number[]) {
        return this.influencerRepository
            .createQueryBuilder('influencer')
            .leftJoin('influencer.user', 'user')
            .select([
                'influencer.id',
            ])
            .addSelect("influencer.avatar", 'user_avatar')
            .where('influencer.id IN (:...ids)', { ids })
            .getRawMany();
    }


    async getRecommendedInfluncerProfileById(ids: number[]) {
        const influncers = await this.influencerRepository
            .createQueryBuilder('influencer')
            .leftJoin('influencer.user', 'user')
            .select([
                'influencer.id',
            ])
            .addSelect("influencer.avatar", 'user_avatar')
            .addSelect("user.id", 'user_id')
            .where('user.id IN (:...ids)', { ids })
            .getRawMany();
        return influncers
    }

}