//
//  TransactionHistoryView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 03/07/2025.
//

import SwiftUI

struct WithdrawalHistoryView: View {
    
    @EnvironmentObject var dialogManager: DialogManager
    
    @State private var isLoading: Bool = false
    @State private var showWithdrawalSheet: Bool = false
    @State private var withdrawalRequests: [ApiResponses.WithdrawalResponse] = []
    @State private var revenueData: ApiResponses.RevenueData? = nil
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                
                Text("Transaction")
                    .font(UBUFonts.manropeBold(withSize: 24))
                    .fontWeight(.medium)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)

                HStack(alignment: .top, spacing: 12) {
                    WithdrawnCardView(amount: String(format: "$%.2f", revenueData?.withdrawanAmount ?? 0.0))

                    VStack(spacing: 12) {
                        AmazonRevenueCardView(amount: String(format: "$%.2f", revenueData?.affiliateRevenue ?? 0.0))
                        AmazonRevenueCardView(amount: String(format: "$%.2f", revenueData?.campaignRevenue ?? 0.0))
                    }
                }
                .frame(height: 220)
                .padding(.horizontal)
                
                AvailableBalanceCard(amount: String(format: "$%.2f", revenueData?.withdrawalableAmount ?? 0.0)) {
                    showWithdrawalSheet.toggle()
                }
                .padding(.horizontal)

                WithdrawalsSection(withdrawals: withdrawalRequests)
                    .padding(.horizontal)
            }
            .padding(.top)

            .onAppear {
                fetchWithdrawalRequests()
                fetchWithdrawalRevenueRequests()
            }
            .floatingBottomSheet(isPresented: $showWithdrawalSheet) {
                CreateWithdarawalSheet(isPresented: $showWithdrawalSheet, action: { amount in
                        withdrawFunds(amount)
                    }, availableBalance: revenueData?.withdrawalableAmount ?? 0.0)
                .presentationDetents([.height(330)])
            }
        }
    }
    
    // MARK: - Reusable Components
    
    struct AvailableBalanceCard: View {
        let amount: String
        let onWithdraw: () -> Void
        
        var body: some View {
            HStack {
                VStack(alignment: .leading, spacing: 6) {
                    Text("Available")
                        .foregroundColor(.primaryColor)
                        .font(UBUFonts.manropeBold(withSize: 12))
                    Text(amount)
                        .foregroundColor(.primaryColor)
                        .font(UBUFonts.manropeBold(withSize: 24))
                }
                Spacer()
                Button(action: onWithdraw) {
                    HStack(spacing: 8) {
                        Image(systemName: "arrow.left.arrow.right")
                        Text("Withdraw")
                            .foregroundColor(.white)
                            .font(UBUFonts.manropeSemibold(withSize: 14))
                    }
                    .foregroundColor(.white)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 13)
                    .background(Color.black)
                    .cornerRadius(13)
                }
            }
            .padding()
            .background(RoundedRectangle(cornerRadius: 14).fill(Color(hex: "#FAC576")))
        }
    }
    
    struct WithdrawnCardView: View {
        let amount: String
         
        var body: some View {
          VStack(alignment: .leading, spacing: 6) {
            Image(systemName: "dollarsign.circle")
              .resizable()
              .frame(width: 40, height: 40)
              .padding(.top ,15)
              .foregroundColor(Color(hex: "#FAC576"))
            Text("Amount Withdrawn")
              .foregroundColor(.white)
              .font(UBUFonts.manropeBold(withSize: 16))
            Text(amount)
              .foregroundColor(Color(hex: "#FAC576"))
              .font(UBUFonts.manropeBold(withSize: 24))
             
          }
          .frame(width: 150, height: 200, alignment: .topLeading)
          .padding()
          .background(RoundedRectangle(cornerRadius: 14).fill(Color.black))
        }
      }
       
       
      struct AmazonRevenueCardView: View {
        let amount: String
         
        var body: some View {
          VStack(alignment: .leading, spacing: 3) {
            Image(systemName: "dollarsign.circle")
              .resizable()
              .frame(width: 20, height: 20)
              .padding(5)
              .foregroundColor(Color(hex: "#FAC576"))
            Text("Affiliate Revenue")
              .foregroundColor(.white)
              .font(UBUFonts.manropeBold(withSize: 12))
            Text(amount)
              .foregroundColor(Color(hex: "#FAC576"))
              .font(UBUFonts.manropeBold(withSize: 20))

          }
          .frame(width: 160, height: 100, alignment: .topLeading)
          .padding(EdgeInsets(top: 10, leading: 12, bottom: 0, trailing: 5))
          .background(RoundedRectangle(cornerRadius: 14).fill(Color.black))
        }
      }
    
    struct WithdrawalsSection: View {
        let withdrawals: [ApiResponses.WithdrawalResponse]
        
        var body: some View {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Text("Withdrawals")
                        .font(UBUFonts.manropeBold(withSize: 16))
                        .foregroundColor(.primaryColor)
                    
                    Spacer()
                }
                
                ForEach(withdrawals, id: \.id) { withdrawal in
                    WithdrawalCell(
                        id: String(format: "%03d", withdrawal.id),
                        amount:  String(withdrawal.amount ?? "0.0"),
                        currency: withdrawal.currency ?? "0.0",
                        date: Utilities.formatDate(withdrawal.createdAt ?? "N/A") ?? "N/A",
                        status: withdrawal.status?.rawValue.capitalized ?? ApiResponses.WithdrawalResponse.WithdrawalStatus.pending.rawValue.capitalized
                    )
                }
            }
            .padding(.top, 4)
        }
    }
    
    
    struct WithdrawalCell: View {
        let id: String
        let amount: String
        let currency: String
        let date: String
        let status: String
        
        var statusColor: Color {
            switch status.lowercased() {
            case "pending": return Color.orange
            case "succeeded": return Color.green
            case "failed": return Color.red
            default: return Color.black.opacity(0.6)
            }
        }
        
        var body: some View {
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    Text("#\(id)")
                        .font(UBUFonts.manropeBold(withSize: 15))
                        .foregroundColor(.primaryColor)
                    Spacer()
                    Text(status)
                        .font(UBUFonts.manropeBold(withSize: 12))
                        .foregroundColor(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 6)
                        .background(statusColor)
                        .clipShape(Capsule())
                }
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        Text("Withdraw Amount")
                            .foregroundColor(.primaryColor.opacity(0.7))
                            .font(UBUFonts.manropeMedium(withSize: 12))
                        Spacer()
                        Text(amount)
                            .font(UBUFonts.manropeBold(withSize: 12))
                            .foregroundColor(.primaryColor)
                    }
                    HStack {
                        Text("Currency")
                            .foregroundColor(.primaryColor.opacity(0.7))
                            .font(UBUFonts.manropeMedium(withSize: 12))
                        Spacer()
                        Text(currency)
                            .foregroundColor(.primaryColor)
                            .font(UBUFonts.manropeBold(withSize: 12))
                    }
                    HStack {
                        Text("Withdraw Date")
                            .foregroundColor(.primaryColor.opacity(0.7))
                            .font(UBUFonts.manropeMedium(withSize: 12))
                        Spacer()
                        Text(date)
                            .foregroundColor(.primaryColor)
                            .font(UBUFonts.manropeBold(withSize: 12))
                    }
                }
            }
            .padding(18)
            .background(
                ZStack {
                    RoundedRectangle(cornerRadius: 18)
                        .fill(
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color(red: 1.0, green: 0.98, blue: 0.94),
                                    Color(red: 0.96, green: 0.98, blue: 1.0)
                                ]),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                }
            )
            .shadow(color: Color.black.opacity(0.11), radius: 18, x: 0, y: 8)
            .shadow(color: Color.black.opacity(0.03), radius: 2, x: 0, y: 1)
        }
    }
    
    struct CreateWithdarawalSheet: View {
        @Binding var isPresented: Bool
        var action: (String) -> Void
        var availableBalance: Double = 0.0
        @State private var amount: String = ""
        
        var body: some View {
            VStack(spacing: 20) {
                
                Image(systemName: "creditcard.fill")
                    .font(.title)
                    .foregroundStyle(.white)
                    .frame(width: 65, height: 65)
                    .background(.primaryColor.gradient, in: .circle)
                    .background {
                        Circle()
                            .stroke(.background, lineWidth: 8)
                    }
                
                Text("Withdraw Funds")
                    .font(UBUFonts.manropeBold(withSize: 16))
                
                TextField("Enter amount", text: $amount)
                .padding(.horizontal)
                .frame(height: 40)
                .background(
                    RoundedRectangle(cornerRadius: 8).strokeBorder(Color.gray,lineWidth: 0.8)
                )
                
                HStack(spacing: 0) {
                    Text("Available Balance:")
                        .font(UBUFonts.manropeMedium(withSize: 12))
                        .foregroundStyle(.primaryColor.opacity(0.7))
                    Text(String(format: "%.2f", availableBalance))
                        .font(UBUFonts.manropeBold(withSize: 12))
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                
                HStack {
                    Button(action: {isPresented.toggle()}) {
                        Label("Cancel", systemImage: "oar.2.crossed")
                    }
                    .styledButton(type: .stroke)
                    
                    Button(action: {action(amount)}) {
                        Label("Withdraw", systemImage: "creditcard.and.123")
                    }
                    .styledButton(type: .primary)
                }
            }
            .padding([.horizontal, .bottom], 15)
            .background {
                RoundedRectangle(cornerRadius: 15)
                    .fill(.background)
                    .padding(.top, 30)
            }
            .shadow(color: .black.opacity(0.12), radius: 8)
            .padding(.horizontal, 15)
        }
    }
    
    
    // MARK: - Network Calls
    
    private func fetchWithdrawalRequests() {
        guard let id = StateManager.shared.userProfile?.id else { return }
        NetworkService.shared.fetchWithdrawalRequests(id: String(id)) { result in
            switch result {
            case .success(let withdrawalRequests):
                print("Res: \(withdrawalRequests)")
                self.withdrawalRequests = withdrawalRequests
            case .failure(let error):
                print("Error: \(error)")
            }
        }
    }
    
    private func fetchWithdrawalRevenueRequests() {
        guard let id = StateManager.shared.userProfile?.id else { return }
        NetworkService.shared.fetchWithdrawalRevenueRequests(id: String(id)) { result in
            switch result {
            case .success(let withdrawalRequests):
                self.revenueData = withdrawalRequests
            case .failure(let error):
                print("Error: \(error)")
            }
        }
    }
    
    private func withdrawFunds(_ amount: String) {
        guard let id = StateManager.shared.userProfile?.id else { return }
        guard let amountInDouble = Double(amount) else { return }
        
        if amountInDouble < 10 {
            dialogManager
                .showError(
                    title: "Minimum Withdrawal Limit",
                    message: "You must withdraw at least $10. Please enter a valid amount.",
                    action: {}
                )
            showWithdrawalSheet.toggle()
            return
        }
        
        NetworkService.shared.createWithdrawalRequest(
            params: .init(amount: amountInDouble, influencerId: id, stripeConnectedId: nil)
        ) { result in
            switch result {
            case .success(let transaction):
                showWithdrawalSheet.toggle()
                withdrawalRequests.insert(transaction, at: 0)
                fetchWithdrawalRevenueRequests()
            case .failure(let error):
                print("Error: \(error)")
            }
        }
    }
}

#Preview {
    WithdrawalHistoryView()
}
