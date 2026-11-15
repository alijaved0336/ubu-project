//
//  RelationshipRequest.swift
//  UBU
//
//  Created by Irtaza Fiaz on 18/07/2025.
//

import SwiftUI

struct RelationRequestResponse: Decodable {
    
    let requests: [Request]
    
    struct Request: Decodable, Identifiable {
        let id: Int
        let requesterId: Int
        let requesteeId: Int
        let relationType: ProfileRelationship
        let requestFor: String
        let status: Status
        let requester: User
        let requestee: User
        
        enum CodingKeys: String, CodingKey {
            case id, status
            case requesterId = "requester_id"
            case requesteeId = "requestee_id"
            case relationType = "relationType"
            case requestFor = "requestFor"
            case requester, requestee
        }
    }
    
    enum Status: String, Decodable {
        case pending = "Pending"
        case approved = "Accepted"
        case rejected = "Rejected"
    }
    
    struct User: Decodable {
        let id: Int
        let firstName: String?
        let lastName: String?
        let email: String
        let avatar: String?
        
        enum CodingKeys: String, CodingKey {
            case id
            case firstName = "first_name"
            case lastName = "last_name"
            case email
            case avatar = "avatar"
        }
    }
}

extension RelationRequestResponse {
    static var mock: RelationRequestResponse {
        return RelationRequestResponse(
            requests: [
                .init(
                    id: 101,
                    requesterId: 1,
                    requesteeId: 2,
                    relationType: .father,
                    requestFor: "Medical Access", status: .pending,
                    requester: .init(
                        id: 1, firstName: "Usman",
                        lastName: "Shahid",
                        email: "usmanshahidpm+3@gmail.com",
                        avatar: "https://example.com/avatars/usman.jpg"
                    ),
                    requestee: .init(
                        id: 5, firstName: "Ali",
                        lastName: "Raza",
                        email: "ali.raza@example.com",
                        avatar: nil
                    )
                ),
                .init(
                    id: 102,
                    requesterId: 3,
                    requesteeId: 4,
                    relationType: .mother,
                    requestFor: "Emergency Contact", status: .approved,
                    requester: .init(
                        id: 2, firstName: "Sara",
                        lastName: "Ahmed",
                        email: "sara.ahmed@example.com",
                        avatar: nil
                    ),
                    requestee: .init(
                        id: 4, firstName: "Nadia",
                        lastName: "Khan",
                        email: "nadia.khan@example.com",
                        avatar: "https://example.com/avatars/nadia.jpg"
                    )
                )
            ]
        )
    }
}

