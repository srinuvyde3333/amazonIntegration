Public class amazonIntegration{
    @AuraEnabled
    Public static String amazonDetails (String ProductName, String CountryCode){
        HTTP Htp = new HTTP();
        HTTPRequest req = new HTTPRequest();
        String query = ProductName;
        String encodedQuery = EncodingUtil.urlEncode(query, 'UTF-8');
        req.setEndpoint('callout:amazon/search?query='+encodedQuery+'&country='+CountryCode);
        req.setMethod('GET');
        try{
            HTTPResponse res = Htp.send(req);
            if(res.getStatusCode()==200)
            {
                System.debug('Response =>'+res.getBody());
                return res.getBody();
            }
            else
            {
                System.debug('Error: ' + res.getStatusCode() + ' - ' + res.getBody());
                return 'Error: ' + res.getBody();
                
            }
        }
        catch(Exception e){
            System.debug('Error occured'+e.getMessage());
            return 'Exception : '+e.getMessage();
        }
        
    }
}
