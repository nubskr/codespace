#include <bits/stdc++.h>
using namespace std;
#define int long long

int32_t main(){
  ios::sync_with_stdio(0); 
  cin.tie(0);
  
  auto solve = [&]() {
      int a,b;
      cin >> a >> b;
      cout << a+b << endl;
  };

  int t = 1;
  cin >> t;
  for(int i = 1; i <= t; i++){solve();}
}
