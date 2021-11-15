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
    const createdToken: IClinicQueueModel | null = await ClinicQueueModel.findOneAndUpdate({ _id: tokenId }, { $set: { tokenStatus: tokenStatus } }, { new: true })
      .populate("userId")
      .populate("clinicId");

    return createdToken;
  }
  async getTokenById(tokenId: string): Promise<IClinicQueueModel | null> {
    const token: IClinicQueueModel | null = await ClinicQueueModel.findById(tokenId).populate("userId").populate("clinicId");

    return token;
  }

  async getTokenForRequiredStatusbyUserId(userId: string, listOfStatus: TokenStatusEnum[]): Promise<IClinicQueueModel[]> {
    const userToken: IClinicQueueModel[] = await ClinicQueueModel.find({
      $and: [{ userId: userId }, { tokenStatus: { $in: listOfStatus } }]
    })
      .populate("userId")
      .populate("clinicId");

    return userToken;
  }
  async getTokenForRequiredStatusByClinicId(clinicId: string, listOfStatus: TokenStatusEnum[]): Promise<IClinicQueueModel[]> {
    const userToken: IClinicQueueModel[] = await ClinicQueueModel.find({
      $and: [{ clinicId: clinicId }, { tokenStatus: { $in: listOfStatus } }]
    })
      .populate("userId")
      .populate("clinicId");

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
      .sort({ updatedAt: 1 })
      .populate("userId")
      .populate("clinicId");
    return fetchedTokens;
  }
}

export default new ClinicQueueDao();
