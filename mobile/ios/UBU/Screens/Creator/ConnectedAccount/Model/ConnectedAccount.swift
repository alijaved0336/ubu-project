//
//  ConnectedAccount.swift
//  UBU
//
//  Created by Irtaza Fiaz on 02/07/2025.
//

import SwiftUI

struct ConnectedAccountResponse: Codable {
    let message: String
    let data: ConnectedAccountData?
    
    struct ConnectedAccountData: Codable {
        let accountInfo: AccountInfo?
        let updatedConnectedAccount: UpdatedConnectedAccount
    }
    
    struct AccountInfo: Codable {
        let externalAccounts: ExternalAccounts?
        let email: String?
        let chargesEnabled: Bool?
        let payoutsEnabled: Bool?
        let id: String?
        let requirements: Requirements?

        enum CodingKeys: String, CodingKey {
            case email, id, requirements
            case externalAccounts = "external_accounts"
            case chargesEnabled = "charges_enabled"
            case payoutsEnabled = "payouts_enabled"
        }
        
    }
    
    struct ExternalAccounts: Codable {
        let data: [ExternalAccount]?
        let hasMore: Bool?
        let totalCount: Int?
        let url: String?
        
        enum CodingKeys: String, CodingKey {
            case data, url
            case hasMore = "has_more"
            case totalCount = "total_count"
        }
    }
    
    struct ExternalAccount: Codable {
        let id: String?
        let account: String?
        let accountHolderName: String?
        let accountHolderType: String?
        let accountType: String?
        let availablePayoutMethods: [String]?
        let bankName: String?
        let country: String?
        let currency: String?
        let defaultForCurrency: Bool?
        let fingerprint: String?
        let last4: String?
        let metadata: [String: String]?
        let routingNumber: String?
        let status: String?
        
        enum CodingKeys: String, CodingKey {
            case id, account, country, currency, fingerprint, last4, metadata, status
            case accountHolderName = "account_holder_name"
            case accountHolderType = "account_holder_type"
            case accountType = "account_type"
            case availablePayoutMethods = "available_payout_methods"
            case bankName = "bank_name"
            case defaultForCurrency = "default_for_currency"
            case routingNumber = "routing_number"
        }
    }
    
    struct Requirements: Codable {
        let alternatives: [RequirementFieldsDue]?
        let currentlyDue: [String]?
        let disabledReason: String?
        let errors: [RequirementErrors]?
        let eventuallyDue: [String]?
        let pastDue: [String]?
        let pendingVerification: [String]?
        
        enum CodingKeys: String, CodingKey {
            case alternatives, errors
            case currentlyDue = "currently_due"
            case disabledReason = "disabled_reason"
            case eventuallyDue = "eventually_due"
            case pastDue = "past_due"
            case pendingVerification = "pending_verification"
        }
    }
    
    struct RequirementFieldsDue: Codable {
        let alternativeFieldsDue: [String]?
        let originalFieldsDue: [String]?
        
        enum CodingKeys: String, CodingKey {
            case alternativeFieldsDue = "alternative_fields_due"
            case originalFieldsDue = "original_fields_due"
        }
    }
    
    struct RequirementErrors: Codable {
        let code: String?
        let reason: String?
        let requirement: String?
    }
    
    
    
    struct UpdatedConnectedAccount: Codable {
        let id: Int
        let stripeConnectedAccountId: String?
        let status: UpdatedConnectedAccountStatus?
        
        enum CodingKeys: String, CodingKey {
            case id, status
            case stripeConnectedAccountId = "stripe_connected_account_id"
        }
    }
    
    enum UpdatedConnectedAccountStatus: String, Codable {
        case pending = "pending"
        case inProgress = "in-progress"
        case inActive = "in-active"
        case completed = "completed"
    }
    
}

extension ConnectedAccountResponse {
    static var mock: ConnectedAccountResponse {
        ConnectedAccountResponse(
            message: "",
            data: .init(
                accountInfo: .init(
                    externalAccounts: .init(
                        data: [
                            .init(
                                id: "1",
                                account: "test_acc",
                                accountHolderName: nil,
                                accountHolderType: nil,
                                accountType: nil,
                                availablePayoutMethods: nil,
                                bankName: "STRIPE TEST BANK",
                                country: "US",
                                currency: "USD",
                                defaultForCurrency: nil,
                                fingerprint: nil,
                                last4: "6789",
                                metadata: nil,
                                routingNumber: "110000000",
                                status: "new"
                            )
                        ],
                        hasMore: false,
                        totalCount: 1,
                        url: nil
                    ),
                    email: "irtaza.fiaz+22@codingcops.com",
                    chargesEnabled: false,
                    payoutsEnabled: false,
                    id: "acct_123456789",
                    requirements: .init(
                        alternatives: nil,
                        currentlyDue: [
                            "business_profile.url",
                            "individual.email",
                            "individual.address.line1",
                            "tos_acceptance.date"
                        ],
                        disabledReason: nil,
                        errors: nil,
                        eventuallyDue: nil,
                        pastDue: nil,
                        pendingVerification: nil
                    )
                ),
                updatedConnectedAccount: .init(
                    id: 123,
                    stripeConnectedAccountId: "acct_123456789",
                    status: .completed
                )
            )
        )
    }
}
