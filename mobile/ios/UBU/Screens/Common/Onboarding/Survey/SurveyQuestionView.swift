//
//  SurveyQuestionView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 08/08/2024.
//

import SwiftUI

struct SurveyQuestionView: View {
    @Binding var question: SurveyQuestion?
    @Binding var isNextButtonDisabled: Bool
    @Binding var surveyAnswers: SurveyAnswers
    @Binding var isOptionSelected: Bool
    @Binding var selectedGender: String?
    
    @State private var selectedOption: String?
    @State private var selectedOptions: [String] = []
    @State private var searchText: String = ""
    
    @State private var customInputs: [String: String] = [:]
    
    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(alignment: .leading) {
                
                Text(question?.title ?? "")
                    .font(UBUFonts.manropeBold(withSize: 16))
                    .foregroundStyle(.primaryColor)
                    .padding(.top, 5)
                
                if let questionTitle = question?.question {
                    Text(questionTitle)
                        .font(UBUFonts.manropeSemibold(withSize: 14))
                        .foregroundStyle(.primaryColor)
                        .padding(.top, 5)
                }
                
                if let description = question?.description {
                    Text(description)
                        .font(UBUFonts.manropeMedium(withSize: 12))
                        .foregroundStyle(.primaryColor)
                        .padding(.top, 5)
                }
                
                if question?.srNo == Constants.QuestionSrnos.languages {
                    HStack {
                        Image(systemName: "magnifyingglass")
                            .foregroundStyle(.primaryColor)
                            .padding(.leading, 10)
                        TextField(
                            "",
                            text: $searchText,
                            prompt: Text("Search Language").foregroundStyle(.primaryColor)
                        )
                        .padding(.vertical, 5)
                        .font(UBUFonts.manropeSemibold(withSize: 14))
                        .padding(.leading, 5)
                        .tint(.primaryColor)
                    }
                    .foregroundStyle(.primaryColor)
                    .padding(8)
                    .background(.primaryColor.opacity(0.07))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                }
                
                
                
                if let options = question?.options {
                    let filteredOptions = options.filter { searchText.isEmpty || $0.optionTitle.localizedCaseInsensitiveContains(searchText) }
                    let groupedOptions = Dictionary(grouping: filteredOptions) { $0.heading ?? "" }
                    
                    ForEach(groupedOptions.sorted(by: {
                        guard let lhsIndex = Constants.shoeSizeHeadings.firstIndex(of: $0.key),
                              let rhsIndex = Constants.shoeSizeHeadings.firstIndex(of: $1.key) else {
                            return $0.key < $1.key
                        }
                        return lhsIndex < rhsIndex
                    }), id: \.key) { heading, options in
                        VStack(alignment: .leading, spacing: 8) {
                            if question?.srNo == Constants.QuestionSrnos.shoeSize {
                                Text(heading)
                                    .font(UBUFonts.manropeSemibold(withSize:16))
                                    .padding(.top, 12)
                            }
                            
                            ForEach(options.indices, id: \.self) { idx in
                                let opt = options[idx]
                                let clean = Utilities.removeIcons(opt.optionTitle)
                                let key = opt.inputField?.fieldName ?? "" 
                                
                                if question?.isMultiSelected ?? false {
                                    Checkbox(
                                        label: opt.optionTitle,
                                        descriprion: opt.description ?? "",
                                        selectedOptions: $selectedOptions,
                                        inputField: opt.inputField,
                                        customInput: Binding(
                                            get: { customInputs[opt.inputField?.fieldName ?? ""] ?? "" },
                                            set: { customInputs[opt.inputField?.fieldName ?? ""] = $0; updateSurveyAnswers() }
                                        )
                                    )
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .padding(.vertical, 5)
                                    .onChange(of: selectedOptions) {
                                        isNextButtonDisabled = selectedOptions.isEmpty && !(question?.isOptional ?? true)
                                        isOptionSelected = !selectedOptions.isEmpty
                                        updateSurveyAnswers()
                                    }
                                    .padding(.horizontal, 1)
                                } else {
                                    RadioButton(
                                        label: opt.optionTitle,
                                        descriprion: opt.description ?? "",
                                        selectedOption: $selectedOption,
                                        inputField: opt.inputField,
                                        customInput: Binding(
                                            get: { customInputs[opt.inputField?.fieldName ?? ""] ?? "" },
                                            set: { customInputs[opt.inputField?.fieldName ?? ""] = $0; updateSurveyAnswers() }
                                        )
                                    )
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .padding(.vertical, 5)
                                    .onChange(of: selectedOption) {
                                        isNextButtonDisabled = selectedOption == nil && !(question?.isOptional ?? true)
                                        isOptionSelected = selectedOption != nil
                                        updateSurveyAnswers()
                                    }
                                    .padding(.horizontal, 1)
                                }
                            }
                        }
                    }
                }
            }
            .onChange(of: question) {
                loadExistingAnswers()
            }
            .onAppear {
                loadExistingAnswers()
            }
        }
    }
    
    private func loadExistingAnswers() {
        guard let question = question else { return }
        selectedOption = nil
        selectedOptions.removeAll()
        customInputs.removeAll()

        if let existingAnswer = surveyAnswers.answers.first(where: { $0.question == question.id }) {
            if question.isMultiSelected {
                for token in existingAnswer.selectedOptions {
                    if let (field, value) = parseFieldPair(token),
                       let opt = question.options?.first(where: { $0.inputField?.fieldName == field }) {
                        customInputs[field] = value
                        selectedOptions.append(Utilities.removeIcons(opt.optionTitle))
                    } else {
                        selectedOptions.append(Utilities.removeIcons(token))
                    }
                }

            } else {
                if let token = existingAnswer.selectedOptions.first {
                    if let (field, value) = parseFieldPair(token),
                       let opt = question.options?.first(where: { $0.inputField?.fieldName == field }) {
                        selectedOption = opt.optionTitle
                        customInputs[field] = value
                        if question.srNo == Constants.QuestionSrnos.gender {
                            selectedGender = selectedOption
                        }
                    } else {
                        let clean = Utilities.removeIcons(token)
                        selectedOption = clean
                        if question.srNo == Constants.QuestionSrnos.gender {
                            selectedGender = selectedOption
                        }
                    }
                }
            }

            isNextButtonDisabled = question.isOptional ? false : (selectedOption == nil && selectedOptions.isEmpty)
            isOptionSelected = selectedOption != nil || !selectedOptions.isEmpty

        } else if let userAnwsers = question.userAnswers {
            if question.isMultiSelected {
                selectedOptions = userAnwsers
            } else {
                selectedOption = userAnwsers.first
            }
            isNextButtonDisabled = question.isOptional ? false : (selectedOption == nil && selectedOptions.isEmpty)
            isOptionSelected = selectedOption != nil || !selectedOptions.isEmpty

        } else {
            isNextButtonDisabled = !(question.isOptional)
            isOptionSelected = false
        }
    }

    
    private func parseFieldPair(_ raw: String) -> (field: String, value: String)? {
        let parts = raw.split(separator: ":", maxSplits: 1).map { String($0).trimmingCharacters(in: .whitespaces) }
        guard parts.count == 2 else { return nil }
        return (parts[0], parts[1])
    }

    
    private func valueToStore(for option: SurveyOptions, selectedLabel: String?) -> String {
        if let field = option.inputField?.fieldName {
            let text = (customInputs[field] ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
            return text.isEmpty ? field : "\(field): \(text)"
        }
        let clean = Utilities.removeIcons(option.optionTitle)
        return selectedLabel.map(Utilities.removeIcons) ?? clean
    }

    
    private func updateSurveyAnswers() {
        guard let question = question else { return }
        if selectedOption == nil && selectedOptions.isEmpty { return }
        
        var answer = Answer(selectedOptions: [], question: question.id, srNo: question.srNo)
        
        if question.isMultiSelected {
            let mapped: [String] = (question.options ?? []).compactMap { opt in
                let clean = Utilities.removeIcons(opt.optionTitle)
                if selectedOptions.contains(clean) {
                    return valueToStore(for: opt, selectedLabel: clean)
                }
                return nil
            }
            answer.selectedOptions = mapped
            
        } else {
            if let selected = selectedOption,
               let opt = question.options?.first(where: { $0.optionTitle == selected }) {
                if question.srNo == Constants.QuestionSrnos.gender {
                    selectedGender = selected
                }
                answer.selectedOptions = [valueToStore(for: opt, selectedLabel: selected)]
            }
        }
        
        if let index = surveyAnswers.answers.firstIndex(where: { $0.question == question.id }) {
            surveyAnswers.answers[index] = answer
        } else {
            surveyAnswers.answers.append(answer)
        }
    }}

#Preview {
    SurveyQuestionView(question: .constant(mockSurveyData.questions[0]), isNextButtonDisabled: .constant(true), surveyAnswers: .constant(SurveyAnswers(answers: [])), isOptionSelected: .constant(true), selectedGender: .constant("Male"))
}
