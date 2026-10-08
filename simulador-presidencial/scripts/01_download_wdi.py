"""Descarga indicadores WDI (Banco Mundial) desde la réplica DDF de Gapminder/Open Numbers en GitHub.
La API del Banco Mundial no es accesible desde el entorno; la réplica es una copia directa (ver README del repo)."""
import json, os, sys, urllib.request, concurrent.futures as cf
RAW = sys.argv[1]
BASE = "https://raw.githubusercontent.com/open-numbers/ddf--open_numbers--world_development_indicators/master/"
CODES = """sp_pop_totl sp_urb_totl_in_zs sp_rur_totl_zs en_pop_dnst sp_dyn_cbrt_in sp_dyn_cdrt_in sp_dyn_imrt_in sp_dyn_le00_in sp_dyn_tfrt_in sm_pop_netm
sp_pop_0014_to_zs sp_pop_1564_to_zs sp_pop_65up_to_zs sp_pop_dpnd sm_pop_refg sm_pop_refg_or
sl_tlf_totl_in sl_tlf_cact_zs sl_uem_totl_zs sl_uem_1524_zs se_adt_litr_zs se_ter_enrr se_sec_enrr se_prm_enrr si_pov_gini si_pov_dday si_dst_10th_10
sh_xpd_chex_gd_zs eg_elc_accs_zs sh_h2o_smdw_zs sh_sta_smss_zs it_net_user_zs it_cel_sets_p2 sh_sta_mmrt sl_emp_vuln_zs se_xpd_totl_gd_zs sh_med_phys_zs sh_med_beds_zs
ny_gdp_mktp_cd ny_gdp_mktp_kd ny_gdp_mktp_kd_zg ny_gdp_pcap_cd ny_gdp_pcap_pp_kd ny_gdp_pcap_pp_cd ny_gdp_mktp_pp_cd ny_gdp_mktp_pp_kd nv_agr_totl_zs nv_ind_totl_zs nv_ind_manf_zs nv_srv_totl_zs
ne_gdi_totl_zs ne_gdi_ftot_zs ne_con_govt_zs ne_con_prvt_zs ny_gns_ictr_zs fp_cpi_totl_zg ny_gdp_defl_kd_zg sl_gdp_pcap_em_kd ny_gnp_pcap_cd ny_gdp_pcap_kd_zg
gc_rev_xgrt_gd_zs gc_xpn_totl_gd_zs gc_nld_totl_gd_zs gc_dod_totl_gd_zs gc_tax_totl_gd_zs gc_tax_ypft_zs gc_tax_gsrv_rv_zs gc_tax_intt_rv_zs gc_xpn_intp_zs gc_xpn_intp_rv_zs gc_xpn_comp_zs gc_xpn_trft_zs gc_rev_soci_zs
pa_nus_fcrf pa_nus_ppp fr_inr_lend fr_inr_rinr fr_inr_dpst fi_res_totl_cd fi_res_totl_mo fm_lbl_bmny_gd_zs fs_ast_prvt_gd_zs cm_mkt_lcap_gd_zs fm_lbl_bmny_zg
ne_exp_gnfs_zs ne_imp_gnfs_zs ne_trd_gnfs_zs bn_cab_xoka_gd_zs bn_cab_xoka_cd bx_klt_dinv_wd_gd_zs bx_klt_dinv_cd_wd dt_dod_dect_cd dt_dod_dect_gn_zs dt_tds_dect_ex_zs tm_tax_mrch_wm_ar_zs
tx_val_fuel_zs_un tx_val_manf_zs_un tx_val_tech_mf_zs tx_val_food_zs_un tx_val_mmtl_zs_un tx_val_agri_zs_un tm_val_fuel_zs_un tm_val_food_zs_un tm_val_manf_zs_un bx_trf_pwkr_dt_gd_zs dt_oda_odat_gn_zs ne_exp_gnfs_cd ne_imp_gnfs_cd
eg_imp_cons_zs eg_use_pcap_kg_oe eg_use_elec_kh_pc ny_gdp_totl_rt_zs ny_gdp_petr_rt_zs ny_gdp_ngas_rt_zs ny_gdp_minr_rt_zs ny_gdp_coal_rt_zs ny_gdp_frst_rt_zs eg_elc_rnew_zs eg_fec_rnew_zs eg_elc_nucl_zs eg_elc_hyro_zs eg_elc_ngas_zs eg_elc_coal_zs eg_elc_petr_zs
ag_lnd_arbl_zs ag_lnd_frst_zs ag_lnd_agri_zs er_h2o_intr_pc er_h2o_fwst_zs er_h2o_fwtl_zs ag_prd_food_xd ag_yld_crel_kg ag_lnd_totl_k2 ag_srf_totl_k2 sn_itk_defc_zs
is_air_psgr is_air_dprt is_air_good_mt_k1 is_rrs_totl_km is_rrs_good_mt_k6 is_shp_good_tu it_net_bbnd_p2 lp_lpi_ovrl_xq eg_elc_loss_zs
ms_mil_xpnd_gd_zs ms_mil_xpnd_cd ms_mil_xpnd_zs ms_mil_xpnd_cn ms_mil_totl_p1 ms_mil_totl_tf_zs ms_mil_xprt_kd ms_mil_mprt_kd
gb_xpd_rsdv_gd_zs ip_pat_resd ip_pat_nres ip_jrn_artc_sc sp_pop_scie_rd_p6 tx_val_tech_cd bm_gsr_royl_cd bx_gsr_royl_cd ip_tmk_totl
vc_ihr_psrc_p5 vc_btl_deth vc_idp_nwcv vc_idp_nwds vc_idp_tocv vc_pkp_totl_un
en_atm_co2e_pc en_atm_co2e_kt en_ghg_co2_pc_ce_ar5 en_ghg_all_mt_ce_ar5 en_atm_pm25_mc_m3 en_clc_mdat_zs ag_lnd_frst_k2 en_pop_el5m_zs
ic_bus_ease_xq ic_reg_durs gc_dod_totl_cn""".split()
dp = json.load(open(os.path.join(RAW, "wdi_dp.json")))
paths = {r["path"] for r in dp["resources"]}
os.makedirs(os.path.join(RAW, "wdi"), exist_ok=True)
def get(c):
    p = f"datapoints/ddf--datapoints--{c}--by--geo--time.csv"
    if p not in paths: return (c, "NO_EN_REPLICA")
    out = os.path.join(RAW, "wdi", c + ".csv")
    if not os.path.exists(out):
        urllib.request.urlretrieve(BASE + p, out)
    return (c, "OK")
with cf.ThreadPoolExecutor(8) as ex:
    res = list(ex.map(get, CODES))
missing = [c for c, s in res if s != "OK"]
print("ok", len(res) - len(missing), "missing", missing)
json.dump(dict(res), open(os.path.join(RAW, "wdi_status.json"), "w"), indent=1)
