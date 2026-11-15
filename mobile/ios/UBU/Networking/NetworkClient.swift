//
//  NetworkClient.swift
//  UBU
//
//  Created by Irtaza Fiaz on 01/12/2024.
//

import Alamofire
import Foundation

class APIExecutor {
    static let shared = APIExecutor()
    
    func execute<T: Decodable>(
        route: APIRouter,
        responseType: T.Type,
        completion: @escaping (Result<T, ApiError>) -> Void
    ) {
        AF.request(route)
            .validateResponse(of: T.self) { result in
                completion(result)
                StateManager.shared.updateLoadingOverlay(loading: false)
            }
            .cURLDescription { description in
                #if DEBUG
                LogManager.shared.prettyPrint(description, type: .info, title: "\u{1F4BB} cURL")
                #endif
            }
    }
    
    func execute(
        route: APIRouter,
        completion: @escaping (Result<Void, ApiError>) -> Void
    ) {
        AF.request(route)
            .validate()
            .response { response in
                StateManager.shared.updateLoadingOverlay(loading: false)
                switch response.result {
                    case .success:
                        LogManager.shared.log("✅ API Call Success", type: .success)
                        completion(.success(()))
                    case .failure(let error):
                        LogManager.shared.log("❌ API Call Failed: \(error.localizedDescription)", type: .error)
                        if let data = response.data {
                            LogManager.shared.prettyPrintJSON(data, type: .error, title: "❌ Error Response")
                            do {
                                let apiError = try JSONDecoder().decode(ApiError.self, from: data)
                                completion(.failure(apiError))
                            } catch {
                                completion(.failure(ApiError.decodingError(message: "Error decoding API error.")))
                            }
                        } else {
                            completion(.failure(ApiError(from: error)))
                        }
                }
            }
            .cURLDescription { description in
                #if DEBUG
                LogManager.shared.prettyPrint(description, type: .info, title: "\u{1F4BB} cURL")
                #endif
            }
    }
    
    func uploadFiles<T: Encodable>(
        urlRequest: URLRequest,
        parameters: T,
        files: [ApiRequest.MediaFile],
        completion: @escaping (Bool, ApiError?) -> Void
    ) {
        AF.upload(multipartFormData: { multipartFormData in
            let encoder = JSONEncoder()
            if let jsonData = try? encoder.encode(parameters),
               let jsonObject = try? JSONSerialization.jsonObject(with: jsonData) as? [String: Any] {
                for (key, value) in jsonObject {
                    if key == "files" { continue }
                    if let valueString = value as? String {
                        multipartFormData.append(valueString.data(using: .utf8)!, withName: key)
                    } else if let valueArray = value as? [Any] {
                        for arrayValue in valueArray {
                            multipartFormData.append("\(arrayValue)".data(using: .utf8)!, withName: "\(key)[]")
                        }
                    }
                }
            }
            
            for (index, fileData) in files.enumerated() {
                if let data = fileData.data {
                    let fileName: String
                    let mimeType: String
                    
                    switch fileData.type {
                        case .image:
                            fileName = "image\(index).jpeg"
                            mimeType = "image/jpeg"
                        case .video:
                            fileName = "videofile\(index).mp4"
                            mimeType = "video/mp4"
                    }
                    
                    multipartFormData.append(data, withName: "files", fileName: fileName, mimeType: mimeType)
                }
            }
        }, with: urlRequest)
        .validate()
        .response { response in
            StateManager.shared.updateLoadingOverlay(loading: false)
            switch response.result {
                case .success:
                    LogManager.shared.log("✅ File upload succeeded", type: .success)
                    completion(true, nil)
                case .failure(let error):
                    LogManager.shared.log("❌ File upload failed: \(error.localizedDescription)", type: .error)
                    LogManager.shared.prettyPrintJSON(response.data ?? Data(), type: .error, title: "Upload Error Response")
                    let apiError = try? JSONDecoder().decode(ApiError.self, from: response.data!)
                    completion(false, apiError)
            }
        }
        .cURLDescription { description in
            #if DEBUG
            LogManager.shared.prettyPrint(description, type: .info, title: "\u{1F4BB} cURL")
            #endif
        }
    }
}

extension DataRequest {
    @discardableResult
    func validateResponse<T: Decodable>(
        of type: T.Type,
        completion: @escaping (Result<T, ApiError>) -> Void
    ) -> Self {
        return responseDecodable(of: type) { response in
            let status = response.response?.statusCode ?? -1
            let isOK = (200...299).contains(status)
            if isOK {
                #if DEBUG
                if let data = response.data {
                    LogManager.shared.prettyPrintJSON(data, type: .success, title: "✅ API 2xx Response")
                }
                #endif
                switch response.result {
                    case .success(let value):
                        completion(.success(value))
                    case .failure(let error):
                        self.handleDecodingFailure(error: error, data: response.data, completion: completion)
                }
                return
            }
            self.handleNonSuccessResponse(response, completion: completion)
        }
    }
    
    private func handleNonSuccessResponse<T>(
        _ response: AFDataResponse<T>,
        completion: @escaping (Result<T, ApiError>) -> Void
    ) {
        if let data = response.data {
            LogManager.shared.prettyPrintJSON(data, type: .warning, title: "⚠️ Non-2xx Response")
            let decoder = JSONDecoder()
            do {
                let messageResponse = try decoder.decode(MessageResponse.self, from: data)
                let apiError = ApiError.serverError(message: messageResponse.message)
                completion(.failure(apiError))
            } catch {
                completion(.failure(ApiError.decodingError(message: "Decoding error: Unexpected status code.")))
            }
        } else {
            let statusCode = response.response?.statusCode ?? -1
            completion(.failure(ApiError.decodingError(message: "Unexpected status code: \(statusCode)")))
        }
    }
    private func handleDecodingFailure<T>(
        error: AFError,
        data: Data?,
        completion: @escaping (Result<T, ApiError>) -> Void
    ) {
        LogManager.shared.log("❌ Decoding error: \(error.localizedDescription)", type: .error)
        if let data = data {
            LogManager.shared.prettyPrintJSON(data, type: .error, title: "Invalid JSON")
            do {
                let apiError = try JSONDecoder().decode(ApiError.self, from: data)
                completion(.failure(apiError))
            } catch {
                completion(.failure(ApiError.decodingError(message: "Decoding error: Something went wrong.")))
            }
        } else {
            completion(.failure(ApiError(from: error)))
        }
    }
}


struct EmptyResponse: Decodable {}

