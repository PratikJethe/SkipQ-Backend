import { Mongoose } from "mongoose";
import { TokenStatusEnum } from "../../constants/enums/clinic.enum";
import { IClinicQueue, IClinicQueueModel } from "../../interfaces/clinic/clinicQueue.interface";
import { ClinicQueueModel } from "../../models/clinic/clinicQueue.model";

class ClinicQueueDao {
  async createToken(tokenDetails: IClinicQueue): Promise<IClinicQueueModel> {
    const createdToken: IClinicQueueModel = await new ClinicQueueModel(tokenDetails).save();

    return createdToken;
  }
  async updateTokenStatus(tokenId: string, tokenStatus: TokenStatusEnum): Promise<IClinicQueueModel | null> {
    const createdToken: IClinicQueueModel | null = await ClinicQueueModel.findOneAndUpdate({ _id: tokenId }, { $set: { tokenStatus: tokenStatus } }, { new: true });

    return createdToken;
  }
  async getTokenById(tokenId: string): Promise<IClinicQueueModel | null> {
    const token: IClinicQueueModel | null = await ClinicQueueModel.findById(tokenId);

    return token;
  }

  async getReqPendTokenForUserId(userId: string): Promise<IClinicQueueModel[]> {
    const userToken: IClinicQueueModel[] = await ClinicQueueModel.find({
      $and: [{ userId: userId }, { tokenStatus: { $in: [TokenStatusEnum.REQUESTED, TokenStatusEnum.PENDING_TOKEN] } }]
    });

    return userToken;
  }

  async getTokenByIdForUser(tokenId: string, userId: string): Promise<IClinicQueueModel | null> {
    console.log(tokenId, userId);
    const userToken: IClinicQueueModel | null = await ClinicQueueModel.findOne({
      $and: [{ userId: userId }, { _id: tokenId }]
    });
    return userToken;
  }

  async getTokenByIdForClinic(tokenId: string, clinicId: string): Promise<IClinicQueueModel | null> {
    console.log(tokenId, clinicId);
    const userToken: IClinicQueueModel | null = await ClinicQueueModel.findOne({
      $and: [{ clinicId: clinicId }, { _id: tokenId }]
    });
    return userToken;
  }

  async getTokensForRequiredStatus(clinicId: string, tokenStatus: TokenStatusEnum): Promise<IClinicQueueModel[]> {
    const fetchedTokens: IClinicQueueModel[] = await ClinicQueueModel.find({
      $and: [{ clinicId: clinicId }, { tokenStatus: tokenStatus }]
    })
      .populate("userId")
      .populate("clinicId");
    return fetchedTokens;
  }
}

export default new ClinicQueueDao();
