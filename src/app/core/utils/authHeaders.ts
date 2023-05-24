import { HttpHeaders } from "@angular/common/http";

export const getAuthHeaders = () =>{
  const accessToken = localStorage.getItem('accessToken');
  if(!accessToken){
    return
  }
  const authHeaders = new HttpHeaders().set('Authorization', accessToken)
  return authHeaders
}
