//
//  CreatorQuestionSubmitView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 08/04/2025.
//

import SwiftUI

struct CreatorQuestionSubmitView: View {
    @EnvironmentObject var onboardingViewModel: CreatorQuestionViewModel
    @Binding var openPrivacyPolicy: Bool
    
    @State private var text: String = ""
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading) {
                Text("Anything we missed?")
                    .font(UBUFonts.manropeBold(withSize: 16))
                    .foregroundStyle(.primaryColor)
                
                Text("Is there any unique or relevant information about yourself that we haven’t asked about, but that you think might help you match with potential users and brands? (Optional) Please use the space below to share anything you feel could enhance your profile and match you with the right opportunities.")
                    .font(UBUFonts.manropeRegular(withSize: 13))
                    .foregroundStyle(.primaryColor.opacity(0.7))
                
                UBUTextField(label: $text, textfieldType: .normal, placeholder: "Additional Information", hasError: false)
                    .padding(.top, 10)

                Text("Summary and Submission")
                    .font(UBUFonts.manropeBold(withSize: 16))
                    .foregroundStyle(.primaryColor)
                    .padding(.top)
                
                Text("Thank you for joining the UBU Platform and completing your onboarding questionnaire!")
                    .font(UBUFonts.manropeSemibold(withSize: 13))
                    .foregroundStyle(.primaryColor.opacity(0.7))
                    .padding(.top)

                Text("We are thrilled to have you as part of our diverse and vibrant community of creators. At UBU, we believe in the power of individuality and diversity, and we value the unique perspective you bring to our platform. Your responses will help us connect you with brands that resonate with your style, values, and audience")
                    .font(UBUFonts.manropeRegular(withSize: 13))
                    .foregroundStyle(.primaryColor.opacity(0.7))
                    .padding(.top)

                Text("What Happens Next?")
                    .font(UBUFonts.manropeSemibold(withSize: 13))
                    .foregroundStyle(.primaryColor.opacity(0.7))
                    .padding(.top)

                Text("Campaign Matches: When your profile aligns with a brand’s campaign requirements, you will be notified via email and within our communications module on the platform. This ensures you’re always in the loop about potential opportunities.\n\nQualified Match Notifications: Even if you aren't selected for a specific campaign, but your profile matches a significant percentage of the brand’s search parameters, we’ll notify you. In these cases, you’ll have the opportunity to reach out directly to the brand and offer your services, knowing you’re a strong contender for their campaign.")
                    .font(UBUFonts.manropeRegular(withSize: 13))
                    .foregroundStyle(.primaryColor.opacity(0.7))
                    .padding(.top)

                Text("We appreciate your dedication to your craft and look forward to seeing you thrive on the UBU Platform. If you have any questions or need further assistance, please don’t hesitate to contact our support team.")
                    .font(UBUFonts.manropeSemibold(withSize: 13))
                    .foregroundStyle(.primaryColor.opacity(0.7))
                    .padding(.top)

                
                
                HStack(alignment: .top) {
                    Toggle(isOn: $onboardingViewModel.agreedPrivacyPolicy) {
                        VStack(alignment: .leading, spacing: 0) {
                            HStack(spacing: 0) {
                                Text("By Checking this box, you agree to UBU ")
                            }
                            HStack(spacing: 0) {
                                Button { openPrivacyPolicy.toggle()  } label: {
                                    Text("Privacy Policy")
                                        .font(UBUFonts.manropeExtraBold(withSize: 13))
                                        .foregroundStyle(.primaryColor)
                                        .lineSpacing(0)
                                }
                                Text(" and consent to the use of the ")
                            }
                            Text("information that it may collect and use about you.")
                        }
                        .font(UBUFonts.manropeRegular(withSize: 13))
                        .lineSpacing(0)
                    }
                    .foregroundStyle(.primaryColor)
                    .toggleStyle(CheckboxToggleStyle())
                }
                .padding()
                .frame(maxWidth: .infinity)
                .background(StyledBackground())

            }.padding()
        }

    }
}

#Preview {
    CreatorQuestionSubmitView(openPrivacyPolicy: .constant(false)).environmentObject(CreatorQuestionViewModel(shouldLoadAllQuestions: true, path: .constant(NavigationPath())))
}
